import { ApiKeyParams } from '@modules/maps/services/api-key-param.interface';
import { IGeocodeRequest } from '../../geocode-request.interface';
export class MapBoxGeocodeRequest implements IGeocodeRequest {
  params: {
    address?: string;
  } & ApiKeyParams;
}
