import { Injectable } from '@nestjs/common';
import { IMapService } from '../map.service.interface';
import { MapBoxGeocodeRequest } from '../dtos/providers/mapbox/mapbox-geocode-request';
import { MapBoxGeocodeResponse } from '../dtos/providers/mapbox/mapbox-geocode-response';
import axios from 'axios';
import { MapBoxDirectionsRequest } from '../dtos/providers/mapbox/mapbox-directions-request';
import { MapBoxDirectionsResponse } from '../dtos/providers/mapbox/mapbox-directions-response';

@Injectable()
export class MapBoxService implements IMapService {
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

  async directions(
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
}
