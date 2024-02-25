import { IGeocodeRequest } from '../../geocode-request.interface';
export class GoogleMapGeocodeRequest implements IGeocodeRequest {
  params: {
    key: string;
    address?: string;
  };
}
