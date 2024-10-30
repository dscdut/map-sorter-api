import { Injectable } from '@nestjs/common';
import { IMapService } from '../map.service.interface';
import { MapBoxGeocodeRequest } from '../dtos/providers/mapbox/mapbox-geocode-request';
import { MapBoxGeocodeResponse } from '../dtos/providers/mapbox/mapbox-geocode-response';
import axios from 'axios';
import { MapBoxDirectionsRequest } from '../dtos/providers/mapbox/mapbox-directions-request';
import { MapBoxDirectionsResponse } from '../dtos/providers/mapbox/mapbox-directions-response';
import { MAPBOX_WAYPOINT_LIMIT } from '../constant';
import { bulkPreprocessCoordinations } from '../utils';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MapBoxService implements IMapService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private readonly MAPBOX_GEOCODE_API_URL =
    'https://api.mapbox.com/search/geocode/v6';
  private readonly MAPBOX_OPTIMIZED_ROUTE_API_URL =
    'https://api.mapbox.com/optimized-trips/v1';

  async geocode(request: MapBoxGeocodeRequest): Promise<MapBoxGeocodeResponse> {
    const { address, key } = request.params;
    const url = `${this.MAPBOX_GEOCODE_API_URL}/forward?q=${encodeURIComponent(
      address,
    )}&access_token=${encodeURIComponent(key)}`;

    try {
      const response = await axios.get(url);

      if (response.data.features.length === 0) {
        return null;
      }

      return {
        data: {
          location: {
            lat: response.data.features[0].properties.coordinates.latitude,
            lng: response.data.features[0].properties.coordinates.longitude,
          },
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      return null;
    }
  }

  private async smallPointsOptimalPath(
    request: MapBoxDirectionsRequest,
  ): Promise<MapBoxDirectionsResponse> {
    const { origin, destination, waypoints, key } = request.params;
    const coordinates = [
      `${origin.lng},${origin.lat}`,
      ...waypoints.map((waypoint) => `${waypoint.lng},${waypoint.lat}`),
      `${destination.lng},${destination.lat}`,
    ].join(';');

    const url = `${
      this.MAPBOX_OPTIMIZED_ROUTE_API_URL
    }/mapbox/driving/${coordinates}?source=first&destination=last&roundtrip=false&access_token=${encodeURIComponent(
      key,
    )}&overview=full`;

    try {
      const response = await axios.get(url);

      if (response.data.code !== 'Ok') {
        return null;
      }

      return {
        data: {
          status: response.data.code,
          routes: [
            {
              waypoints: response.data.waypoints,
              legs: response.data.trips[0].legs,
              overview_polyline: response.data.trips[0].geometry,
            },
          ],
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      return null;
    }
  }

  private async largePointsOptimalPath(
    request: MapBoxDirectionsRequest,
  ): Promise<MapBoxDirectionsResponse> {
    const { key } = request.params;

    const preprocessWaypointsWithTooManyCoordinations =
      await bulkPreprocessCoordinations(request, this.dataSource);

    const batchSize = MAPBOX_WAYPOINT_LIMIT - 2;
    const batches = [];

    for (
      let i = 0;
      i < preprocessWaypointsWithTooManyCoordinations.length;
      i += batchSize
    ) {
      batches.push(
        preprocessWaypointsWithTooManyCoordinations
          .slice(i, i + batchSize)
          .map((waypoint) => `${waypoint.lng},${waypoint.lat}`),
      );
    }

    const routes = [];
    for (let index = 0; index < batches.length; index++) {
      const batch = batches[index];
      const url = `${
        this.MAPBOX_OPTIMIZED_ROUTE_API_URL
      }/mapbox/driving/${batch.join(
        ';',
      )}?source=first&destination=last&roundtrip=false&access_token=${encodeURIComponent(
        key,
      )}&overview=full`;

      try {
        const response = await axios.get(url);
        if (response.data.code !== 'Ok') {
          continue;
        }

        const currentLastWaypointCoordinate = response.data.waypoints.filter(
          (waypoint) => waypoint.waypoint_index === batch.length - 1,
        )[0].location;

        // append the currentLastWaypointCoordinate to the next batch
        if (index < batches.length - 1) {
          batches[index + 1].unshift(
            `${currentLastWaypointCoordinate[0]},${currentLastWaypointCoordinate[1]}`,
          );
        }

        routes.push({
          waypoints: response.data.waypoints.map((waypoint) => ({
            distance: waypoint.distance,
            location: [waypoint.location[0], waypoint.location[1]],
            name: waypoint.name,
            waypoint_index: waypoint.waypoint_index,
          })),
          legs: response.data.trips[0].legs,
          overview_polyline: response.data.trips[0].geometry,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error.message);
      }
    }

    const filteredRoutes = routes.filter((route) => route !== null);

    return {
      data: {
        status: 'Ok',
        routes: filteredRoutes,
      },
    };
  }

  async directions(
    request: MapBoxDirectionsRequest,
  ): Promise<MapBoxDirectionsResponse> {
    const { waypoints } = request.params;
    if (waypoints.length <= MAPBOX_WAYPOINT_LIMIT - 2) {
      return this.smallPointsOptimalPath(request);
    } else {
      return this.largePointsOptimalPath(request);
    }
  }
}
