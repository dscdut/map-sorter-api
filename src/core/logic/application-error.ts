import { Result } from './errors-handler';
import { UseCaseError } from './usecase-error';

export class UnexpectedError extends Result<UseCaseError> {
  public constructor(err: any) {
    super(false, {
      message: 'An unexpected error occurred.',
      error: err,
    } as UseCaseError);
  }
}
