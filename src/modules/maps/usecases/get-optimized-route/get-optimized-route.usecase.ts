import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOptimizedRouteQuery } from './get-optimized-route.query';
import { GetOptimizedRouteResponse } from './get-optimized-route.response';
import { Inject } from '@nestjs/common';
import { IMapService } from '@modules/maps/services/map.service.interface';
import { Result, failure, success } from '@core/logic/errors-handler';
import {
  NotFoundOptimizedRoute,
  WaypointsLimitExceeded,
} from './get-optimized-route.errors';
import { GetOptimizedRouteDtoResponse } from './get-optimized-route.dto';
import { WAYPOINT_LIMIT } from '@modules/maps/services/constant';

@QueryHandler(GetOptimizedRouteQuery)
export class GetOptimizedRouteUseCase
  implements IQueryHandler<GetOptimizedRouteQuery, GetOptimizedRouteResponse>
{
  constructor(
    @Inject('IMapService') private readonly mapService: IMapService,
  ) {}

  async execute({
    getOptimizedRouteRequestDto,
  }: GetOptimizedRouteQuery): Promise<GetOptimizedRouteResponse> {
    // check the waypoints is exceeding the limit or not
    if (getOptimizedRouteRequestDto.params.waypoints.length > WAYPOINT_LIMIT) {
      return failure(new WaypointsLimitExceeded());
    }
    const result = await this.mapService.directions(
      getOptimizedRouteRequestDto,
    );

    if (!result) {
      return failure(new NotFoundOptimizedRoute());
    }

    return success(
      Result.ok<GetOptimizedRouteDtoResponse>({
        geocoded_waypoints: result.data.geocoded_waypoints,
        routes: result.data.routes,
        status: result.data.status,
      }),
    );
  }
}
