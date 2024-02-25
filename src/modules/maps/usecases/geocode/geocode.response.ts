import { Either, Result } from '@core/logic/errors-handler';
import { NotFoundLocationFromAddress } from './geocode.errors';
import { GeocodeDtoResponse } from './geocode.dto';
import { UnexpectedError } from '@core/logic/application-error';

export type GeocodeResponse = Either<
  NotFoundLocationFromAddress | UnexpectedError,
  Result<GeocodeDtoResponse>
>;
