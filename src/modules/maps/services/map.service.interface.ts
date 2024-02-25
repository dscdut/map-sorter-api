import { IGeocodeRequest } from './dtos/geocode-request.interface';
import { IGeocodeResponse } from './dtos/geocode-response.interface';

export interface IMapService {
  geocode(request: IGeocodeRequest): Promise<IGeocodeResponse>;
}
