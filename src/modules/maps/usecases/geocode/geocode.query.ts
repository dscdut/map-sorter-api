import { GeocodeRequestDto } from './geocode.dto';

export class GeocodeQuery {
  constructor(public readonly geocodeRequestDto: GeocodeRequestDto) {}
}
