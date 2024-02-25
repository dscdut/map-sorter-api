import { Result } from '@core/logic/errors-handler';
import { UseCaseError } from '@core/logic/usecase-error';

export class NotFoundLocationFromAddress extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Location not found from address',
    });
  }
}
