import { Result } from '@core/logic/errors-handler';
import { UseCaseError } from '@core/logic/usecase-error';

export class InvalidIdToken extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Invalid idToken',
    });
  }
}

export class UserProfileNotFound extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'User profile not found',
    });
  }
}
