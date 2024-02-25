import {
  GeocodeDtoResponse,
  GeocodeRequestDto,
} from '@modules/maps/usecases/geocode/geocode.dto';
import { NotFoundLocationFromAddress } from '@modules/maps/usecases/geocode/geocode.errors';
import { GeocodeQuery } from '@modules/maps/usecases/geocode/geocode.query';
import { GeocodeResponse } from '@modules/maps/usecases/geocode/geocode.response';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('maps')
export class MapController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('geocode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['maps'],
    operationId: 'geocode',
    summary: 'Geocode',
    description: 'Convert address to coordinates (latitude and longitude)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: GeocodeDtoResponse,
  })
  async geocode(
    @Query('key') key: string,
    @Query('address') address?: string,
  ): Promise<GeocodeDtoResponse> {
    const geocodeRequestDto: GeocodeRequestDto = {
      params: {
        key,
        address,
      },
    };

    const result = await this.queryBus.execute<GeocodeQuery, GeocodeResponse>(
      new GeocodeQuery(geocodeRequestDto),
    );

    if (result.isSuccess()) {
      return result.value.getValue();
    } else if (result.isFailure()) {
      const error = result.value;

      switch (error.constructor) {
        case NotFoundLocationFromAddress:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }
  }
}
