import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GeocodeQuery } from './geocode.query';
import { GeocodeResponse } from './geocode.response';
import { Inject } from '@nestjs/common';
import { IMapService } from '@modules/maps/services/map.service.interface';
import { Result, failure, success } from '@core/logic/errors-handler';
import { NotFoundLocationFromAddress } from './geocode.errors';
import { GeocodeDtoResponse } from './geocode.dto';

@QueryHandler(GeocodeQuery)
export class GeocodeUseCase
  implements IQueryHandler<GeocodeQuery, GeocodeResponse>
{
  constructor(
    @Inject('IMapService') private readonly mapService: IMapService,
  ) {}

  async execute({ geocodeRequestDto }: GeocodeQuery): Promise<GeocodeResponse> {
    const result = await this.mapService.geocode(geocodeRequestDto);

    if (!result) {
      return failure(new NotFoundLocationFromAddress());
    }

    return success(
      Result.ok<GeocodeDtoResponse>({
        location: {
          lat: result.data.location.lat,
          lng: result.data.location.lng,
        },
      }),
    );
  }
}
