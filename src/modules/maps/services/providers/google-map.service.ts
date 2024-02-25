import { Client } from '@googlemaps/google-maps-services-js';
import { IMapService } from '../map.service.interface';
import { GoogleMapGeocodeRequest } from '../dtos/providers/google-map/gg-map-geocode-request';
import { GoogleMapGeocodeResponse } from '../dtos/providers/google-map/gg-map-geocode-response';

export class GoogleMapService implements IMapService {
  private readonly client: Client;

  constructor() {
    this.client = new Client();
  }

  async geocode(
    request: GoogleMapGeocodeRequest,
  ): Promise<GoogleMapGeocodeResponse> {
    const data = await this.client.geocode(request).then((response) => {
      return response.data.results[0];
    });

    return {
      data: {
        coordinates: {
          lat: data.geometry.location.lat,
          lng: data.geometry.location.lng,
        },
      },
    };
  }
}
