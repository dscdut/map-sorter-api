import { Either, Result } from '@core/logic/errors-handler';
import {
  InvalidIdToken,
  UserProfileNotFound,
} from './login-with-google.errors';
import { AuthGoogleLoginDtoResponse } from './login-with-google.dto';

export type LoginWithGoogleResponse = Either<
  InvalidIdToken | UserProfileNotFound,
  Result<AuthGoogleLoginDtoResponse>
>;
