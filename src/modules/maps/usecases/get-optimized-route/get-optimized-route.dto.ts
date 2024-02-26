import {
  DirectionsRoute,
  GeocodedWaypoint,
} from '@googlemaps/google-maps-services-js';
import { LatLngDto } from '@modules/maps/services/dtos/location.dto';
import { GoogleMapDirectionsRequest } from '@modules/maps/services/dtos/providers/google-map/gg-map-directions-request';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

class GetOptimizedRouteParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  origin: LatLngDto;

  @ApiProperty()
  @IsNotEmpty()
  destination: LatLngDto;

  @ApiPropertyOptional({
    example: [
      {
        lat: 37.774785,
        lng: -122.406067,
      },
      {
        lat: 37.774785,
        lng: -122.406067,
      },
    ],
  })
  @IsOptional()
  waypoints?: LatLngDto[];

  @ApiPropertyOptional()
  @IsOptional()
  optimize?: boolean;
}

export class GetOptimizedRouteRequestDto implements GoogleMapDirectionsRequest {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GetOptimizedRouteParamsDto)
  params: GetOptimizedRouteParamsDto;
}

export class GetOptimizedRouteDtoResponse {
  @ApiProperty({
    example: [
      {
        geocoder_status: 'OK',
        place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
        types: ['locality', 'political'],
      },
    ],
  })
  @IsNotEmpty()
  geocoded_waypoints: GeocodedWaypoint[];

  @ApiProperty({
    example: [
      {
        bounds: {
          northeast: {
            lat: 37.774785,
            lng: -122.406067,
          },
          southwest: {
            lat: 37.774785,
            lng: -122.406067,
          },
        },
        legs: [],
        overview_polyline: {
          points: 'y`~lH~g{uO',
        },
        summary: 'I-80 W',
        warnings: [],
        waypoint_order: [],
      },
    ],
  })
  @IsNotEmpty()
  routes: DirectionsRoute[];

  @ApiProperty({
    enum: ['OK', 'NOT_FOUND', 'ZERO_RESULTS'],
  })
  @IsNotEmpty()
  status: string;
}
