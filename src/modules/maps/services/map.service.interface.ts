import { IDirectionsRequest } from './dtos/directions-request.interface';
import { IDirectionsResponse } from './dtos/directions-response.interface';
import { IGeocodeRequest } from './dtos/geocode-request.interface';
import { IGeocodeResponse } from './dtos/geocode-response.interface';

export interface IMapService {
  geocode(request: IGeocodeRequest): Promise<IGeocodeResponse>;
  directions(request: IDirectionsRequest): Promise<IDirectionsResponse>;
}
