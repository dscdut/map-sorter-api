import { Result } from '@core/logic/errors-handler';
import { UseCaseError } from '@core/logic/usecase-error';

export class NotFoundOptimizedRoute extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Optimized route not found',
    });
  }
}

export class WaypointsLimitExceeded extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Waypoints limit exceeded',
    });
  }
}
