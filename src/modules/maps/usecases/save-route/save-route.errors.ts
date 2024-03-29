import { Result } from '@core/logic/errors-handler';
import { UseCaseError } from '@core/logic/usecase-error';

export class DuplicateRouteName extends Result<UseCaseError> {
  constructor(routeName: string) {
    super(false, {
      message: `Route name "${routeName}" already exists`,
    });
  }
}
