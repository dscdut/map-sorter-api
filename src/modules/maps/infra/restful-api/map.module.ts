import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from '@shared/services/api-config.service';
import { MapController } from './map.controller';
import { GoogleMapService } from '@modules/maps/services/providers/google-map.service';
import { GeocodeUseCase } from '@modules/maps/usecases/geocode/geocode.usecase';

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
    {
      provide: 'IMapService',
      useClass: GoogleMapService,
    },
  ],
})
export class MapModule {}
