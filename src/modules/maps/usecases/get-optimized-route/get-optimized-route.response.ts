import { Either, Result } from '@core/logic/errors-handler';
import {
  NotFoundOptimizedRoute,
  WaypointsLimitExceeded,
} from './get-optimized-route.errors';
import { UnexpectedError } from '@core/logic/application-error';
import { GetOptimizedRouteDtoResponse } from './get-optimized-route.dto';

export type GetOptimizedRouteResponse = Either<
  NotFoundOptimizedRoute | WaypointsLimitExceeded | UnexpectedError,
  Result<GetOptimizedRouteDtoResponse>
>;
