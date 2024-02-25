import {
  IGeocodeResponse,
  IGeocodeResponseData,
} from '../../geocode-response.interface';

export class GoogleMapGeocodeResponse implements IGeocodeResponse {
  data: IGeocodeResponseData;
}
