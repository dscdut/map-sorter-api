import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOptimizedRouteQuery } from './get-optimized-route.query';
import { GetOptimizedRouteResponse } from './get-optimized-route.response';
import { Inject } from '@nestjs/common';
import { IMapService } from '@modules/maps/services/map.service.interface';
import { Result, failure, success } from '@core/logic/errors-handler';
import { NotFoundOptimizedRoute } from './get-optimized-route.errors';
import { GetOptimizedRouteDtoResponse } from './get-optimized-route.dto';

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
    const result = await this.mapService.directions(
      getOptimizedRouteRequestDto,
    );

    if (!result) {
      return failure(new NotFoundOptimizedRoute());
    }

    return success(
      Result.ok<GetOptimizedRouteDtoResponse>({
        routes: result.data.routes,
        status: result.data.status,
      }),
    );
  }
}
