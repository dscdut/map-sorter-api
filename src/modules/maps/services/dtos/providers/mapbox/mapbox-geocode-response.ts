import {
  IGeocodeResponse,
  IGeocodeResponseData,
} from '../../geocode-response.interface';

export class MapBoxGeocodeResponse implements IGeocodeResponse {
  data: IGeocodeResponseData;
}
