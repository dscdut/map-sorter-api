import { GoogleMapGeocodeRequest } from '@modules/maps/services/dtos/providers/google-map/gg-map-geocode-request';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LatLngDto } from '@modules/maps/services/dtos/location.dto';

class GeocodeParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiPropertyOptional()
  @IsOptional()
  address?: string;
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
