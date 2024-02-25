import { Client } from '@googlemaps/google-maps-services-js';
import { IMapService } from '../map.service.interface';
import { GoogleMapGeocodeRequest } from '../dtos/providers/google-map/gg-map-geocode-request';
import { GoogleMapGeocodeResponse } from '../dtos/providers/google-map/gg-map-geocode-response';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleMapService implements IMapService {
  private readonly client: Client;

  constructor() {
    this.client = new Client();
  }

  async geocode(
    request: GoogleMapGeocodeRequest,
  ): Promise<GoogleMapGeocodeResponse> {
    const data = await this.client
      .geocode(request)
      .then((response) => {
        return response.data.results[0];
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        return null;
      });

    if (!data) {
      return null;
    }

    return {
      data: {
        location: {
          lat: data.geometry.location.lat,
          lng: data.geometry.location.lng,
        },
      },
    };
  }
}
