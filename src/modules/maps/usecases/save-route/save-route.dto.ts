import { ApiProperty } from '@nestjs/swagger';
import { MapProvidersEnum } from '@shared/enum/map-providers.enum';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PathDisplayInput {
  @IsString()
  overview_polyline?: string;

  @IsArray()
  input_coordinate?: [number, number][];

  @IsArray()
  waypoint_order?: number[];
}

export class SaveRouteRequestDto {
  @ApiProperty({
    type: String,
    example: 'Route 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: PathDisplayInput,
    example: {
      overview_polyline:
        'g|caBqonsS`{RlfI|~^wcGbvXcr\\j~^qsZnvNkoQ`sHevNnlR{mMtne@{`D`sIcxNhdYmxJpwd@clWfqSs_Bxqf@jrFpdQc{IfmQnTxbn@nYbhh@ibPfic@gxH~eDwbHpjI`FjuJ`pDptI{}ChaKjvDzdKwxFphWcwCf|WsiHh}_@omE|b\\dcZjxh@zwPdrYu`LzcX|nV~yJ`wApaO}`In|QnxEhtOe~AbcXtpBdh_@`uOn{Sb~Nvp\\nzGpmMvyg@`Bl_m@~jSzkl@v~b@bje@dtNpuPvcEd}X_x@jgk@weA~jc@toDvjl@z~L`w',
      input_coordinate: [
        [16.0815, 108.2138],
        [16.4661, 107.5847],
        [10.77, 106.7043],
        [21.0396, 105.855],
        [19.8206, 105.7687],
        [20.4212, 106.1652],
        [10.0342, 105.7834],
      ],
      waypoint_order: [0, 4, 1, 3, 2],
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PathDisplayInput)
  pathDisplayInput?: PathDisplayInput;

  @ApiProperty({
    type: String,
    example: 'GoogleMaps',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(MapProvidersEnum)
  provider: MapProvidersEnum;
}
