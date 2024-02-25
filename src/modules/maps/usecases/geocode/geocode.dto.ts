import { GoogleMapGeocodeRequest } from '@modules/maps/services/dtos/providers/google-map/gg-map-geocode-request';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeocodeParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  address?: string;
}

class LatLngDto {
  @ApiProperty({
    type: Number,
    example: 123.456,
  })
  lat: number;

  @ApiProperty({
    type: Number,
    example: 143.789,
  })
  lng: number;
}

export class GeocodeRequestDto implements GoogleMapGeocodeRequest {
  @ApiProperty()
  @ValidateNested()
  @Type(() => GeocodeParamsDto)
  params: GeocodeParamsDto;
}

export class GeocodeDtoResponse {
  @ApiProperty()
  @ValidateNested()
  @Type(() => LatLngDto)
  location: LatLngDto;
}
