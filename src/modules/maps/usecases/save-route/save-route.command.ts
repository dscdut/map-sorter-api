import { SaveRouteRequestDto } from './save-route.dto';

export class SaveRouteCommand {
  constructor(public readonly saveRouteDto: SaveRouteRequestDto) {}
}
