import { LatLngDto } from '@modules/maps/services/dtos/location.dto';
import { MapBoxDirectionsRequest } from '@modules/maps/services/dtos/providers/mapbox/mapbox-directions-request';
import { WaypointsResponseData } from '@modules/maps/services/dtos/providers/mapbox/mapbox-directions-response';
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

export class GetOptimizedRouteRequestDto implements MapBoxDirectionsRequest {
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
        waypoints: [
          {
            distance: 7.6815124706736535,
            name: 'Đường Thanh Long',
            location: [108.213862, 16.081465],
            waypoint_index: 0,
            trips_index: 0,
          },
          {
            distance: 18.529219668414765,
            name: 'Nguyễn Công Trứ',
            location: [106.704231, 10.770153],
            waypoint_index: 1,
            trips_index: 0,
          },
          {
            distance: 62.45417564048826,
            name: '',
            location: [105.854519, 21.039262],
            waypoint_index: 5,
            trips_index: 0,
          },
          {
            distance: 4.33714994203483,
            name: 'Lý Thái Tông',
            location: [105.76867, 19.820627],
            waypoint_index: 3,
            trips_index: 0,
          },
          {
            distance: 23.514850772841235,
            name: 'Phan Bội Châu',
            location: [106.165141, 20.420995],
            waypoint_index: 4,
            trips_index: 0,
          },
          {
            distance: 30.47384074140552,
            name: 'Nguyễn Khuyến',
            location: [105.78316, 10.034339],
            waypoint_index: 2,
            trips_index: 0,
          },
          {
            distance: 2.6927319439616926,
            name: 'Cầu Phú Xuân',
            location: [107.584681, 16.466084],
            waypoint_index: 6,
            trips_index: 0,
          },
        ],
        legs: [],
        overview_polyline:
          'e|caBsonsS~fNh_Lnib@wiHdmvAsieBzpq@_sEvvpA_f{@`kuBhsCpdeBgtg@dvl@xpF|}vAwf_@`ssArop@ltQ}sNpka@hj[`z`AqnEtrlB|xhAvkFnhpAbafA`soAs}Bp||ArcXrtfChbZdcq@zwd@|jZpoTlaqA`ix@biSqhx@cjSmpTicqAesh@i~_@qkeBh}^_al@nvf@ucfAbzE{qYylv@cws@k_QirT||Emig@bdcAsopBgxVgh{Atff@osMilOm_v@cyFiqg@nom@}nyAgw@suj@avQkey@hpPi}Zpb_@k|XstPmgz@hoBs`uBpc`CgyhAl}V_dPzpTqqyA}fTihf@rab@opDyh{@}aYkoOlaOizb@y{QmfJh`C{_p@sqOynGkfhA_zRimg@~hh@spSqqScl_@jeXyi`BlhL_fw@ekZouzAffEitJo|Rmo~@aoL{vt@{|~@abVnii@at`BziQn{uCwr_@zcWlhc@dxmA`j`@ppvAepE`fw@lkZfzzAcoQram@aun@fy{@k{pBnwu@`wFvpj@o|Wr}dAmelAhmiAibi@zbu@wfnA',
      },
    ],
  })
  @IsNotEmpty()
  routes: {
    waypoints: WaypointsResponseData;
    legs: [];
    overview_polyline: string;
  }[];

  @ApiProperty({
    enum: ['Ok', 'NoRoute', 'NoTrips'],
  })
  @IsNotEmpty()
  status: string;
}
