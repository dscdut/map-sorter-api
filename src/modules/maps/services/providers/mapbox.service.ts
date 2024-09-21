import { Injectable } from '@nestjs/common';
import { IMapService } from '../map.service.interface';
import { MapBoxGeocodeRequest } from '../dtos/providers/mapbox/mapbox-geocode-request';
import { MapBoxGeocodeResponse } from '../dtos/providers/mapbox/mapbox-geocode-response';
import axios from 'axios';
import { MapBoxDirectionsRequest } from '../dtos/providers/mapbox/mapbox-directions-request';
import { MapBoxDirectionsResponse } from '../dtos/providers/mapbox/mapbox-directions-response';

@Injectable()
export class MapboxService implements IMapService {
  private readonly MAPBOX_GEOCODE_API_URL =
    'https://api.mapbox.com/search/geocode/v6';

  async geocode(request: MapBoxGeocodeRequest): Promise<MapBoxGeocodeResponse> {
    const { address, key } = request.params;
    const url = `${this.MAPBOX_GEOCODE_API_URL}/forward?q=${encodeURIComponent(
      address,
    )}&access_token=${key}`;

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
    return {
      data: null,
    };
  }
}
