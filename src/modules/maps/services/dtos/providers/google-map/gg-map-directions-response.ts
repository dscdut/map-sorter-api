import { DirectionsResponse as GGMapServiceDirectionsResponse } from '@googlemaps/google-maps-services-js';
import { IDirectionsResponse } from '../../directions-response.interface';

export class GoogleMapDirectionsResponse implements IDirectionsResponse {
  data: GGMapServiceDirectionsResponse['data'];
}
