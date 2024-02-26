import { DirectionsRequest as GGMapServiceDirectionsRequest } from '@googlemaps/google-maps-services-js';
import { IDirectionsRequest } from '../../directions-request.interface';
import { ApiKeyParams } from '@modules/maps/services/api-key-param.interface';

export class GoogleMapDirectionsRequest implements IDirectionsRequest {
  params: GGMapServiceDirectionsRequest['params'] & ApiKeyParams;
}
