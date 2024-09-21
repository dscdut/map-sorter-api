import { IDirectionsRequest } from '../../directions-request.interface';
import { ApiKeyParams } from '@modules/maps/services/api-key-param.interface';

export class MapBoxDirectionsRequest implements IDirectionsRequest {
  params: {
    origin: {
      lat: number;
      lng: number;
    };
    destination: {
      lat: number;
      lng: number;
    };
    waypoints?: {
      lat: number;
      lng: number;
    }[];
    optimize?: boolean;
  } & ApiKeyParams;
}
