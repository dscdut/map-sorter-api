import { Either, Result } from '@core/logic/errors-handler';
import {
  InvalidIdToken,
  UserProfileNotFound,
} from './login-with-google.errors';
import { AuthGoogleLoginDtoResponse } from './login-with-google.dto';
import { UnexpectedError } from '@core/logic/application-error';

export type LoginWithGoogleResponse = Either<
  InvalidIdToken | UserProfileNotFound | UnexpectedError,
  Result<AuthGoogleLoginDtoResponse>
>;
