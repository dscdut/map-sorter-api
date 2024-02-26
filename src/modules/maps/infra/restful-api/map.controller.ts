import {
  GeocodeDtoResponse,
  GeocodeRequestDto,
} from '@modules/maps/usecases/geocode/geocode.dto';
import { NotFoundLocationFromAddress } from '@modules/maps/usecases/geocode/geocode.errors';
import { GeocodeQuery } from '@modules/maps/usecases/geocode/geocode.query';
import { GeocodeResponse } from '@modules/maps/usecases/geocode/geocode.response';
import { GetOptimizedRouteDtoResponse } from '@modules/maps/usecases/get-optimized-route/get-optimized-route.dto';
import {
  NotFoundOptimizedRoute,
  WaypointsLimitExceeded,
} from '@modules/maps/usecases/get-optimized-route/get-optimized-route.errors';
import { GetOptimizedRouteQuery } from '@modules/maps/usecases/get-optimized-route/get-optimized-route.query';
import { GetOptimizedRouteResponse } from '@modules/maps/usecases/get-optimized-route/get-optimized-route.response';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetOptimizedRouteRequestDto } from '../../usecases/get-optimized-route/get-optimized-route.dto';

@Controller('maps')
export class MapController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post('geocode')
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
    @Body() geocodeRequestDto: GeocodeRequestDto,
  ): Promise<GeocodeDtoResponse> {
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

  @Post('optimized-route')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['maps'],
    operationId: 'optimized-route',
    summary: 'Optimized Route',
    description: 'Get optimized route with geocoded waypoints and routes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: GetOptimizedRouteDtoResponse,
  })
  async optimizedRoute(
    @Body() getOptimizedRouteRequestDto: GetOptimizedRouteRequestDto,
  ): Promise<GetOptimizedRouteDtoResponse> {
    const result = await this.queryBus.execute<
      GetOptimizedRouteQuery,
      GetOptimizedRouteResponse
    >(new GetOptimizedRouteQuery(getOptimizedRouteRequestDto));

    if (result.isSuccess()) {
      return result.value.getValue();
    } else if (result.isFailure()) {
      const error = result.value;

      switch (error.constructor) {
        case NotFoundOptimizedRoute:
        case WaypointsLimitExceeded:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }
  }
}
