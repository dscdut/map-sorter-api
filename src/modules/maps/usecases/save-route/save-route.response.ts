import { Either, Result } from '@core/logic/errors-handler';
import { UnexpectedError } from '@core/logic/application-error';
import { DuplicateRouteName } from './save-route.errors';

export type SaveRouteResponse = Either<
  DuplicateRouteName | UnexpectedError,
  Result<void>
>;
