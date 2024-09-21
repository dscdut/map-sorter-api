import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from '@shared/services/api-config.service';
import { MapController } from './map.controller';
import { GeocodeUseCase } from '@modules/maps/usecases/geocode/geocode.usecase';
import { GetOptimizedRouteUseCase } from '@modules/maps/usecases/get-optimized-route/get-optimized-route.usecase';
import { TypeOrmRouteRepository } from '@modules/maps/repos/implementations/typeorm.route.repository';
import { SaveRouteUseCase } from '@modules/maps/usecases/save-route/save-route.usecase';
import { MapBoxService } from '@modules/maps/services/providers/mapbox.service';

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.secret,
        signOptions: {
          expiresIn: configService.authConfig.expiresIn,
        },
      }),
      inject: [ApiConfigService, ConfigService],
    }),
  ],
  controllers: [MapController],
  providers: [
    GeocodeUseCase,
    GetOptimizedRouteUseCase,
    SaveRouteUseCase,
    {
      provide: 'IMapService',
      useClass: MapBoxService,
    },
    {
      provide: 'IRouteRepository',
      useClass: TypeOrmRouteRepository,
    },
  ],
  exports: ['IRouteRepository', 'IMapService', PassportModule],
})
export class MapModule {}
