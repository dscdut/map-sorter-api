import { GetOptimizedRouteRequestDto } from './get-optimized-route.dto';

export class GetOptimizedRouteQuery {
  constructor(
    public readonly getOptimizedRouteRequestDto: GetOptimizedRouteRequestDto,
  ) {}
}
