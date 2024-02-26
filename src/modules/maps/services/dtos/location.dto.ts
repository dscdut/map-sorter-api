import { ApiProperty } from '@nestjs/swagger';

export class LatLngDto {
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
