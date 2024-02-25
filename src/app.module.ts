import 'reflect-metadata';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiConfigService } from '@shared/services/api-config.service';
import { SharedModule } from '@shared/services/shared.module';
import { MediaModule } from './modules/media/media.module';
import { UserModule } from '@modules/users/infra/restful-api/user.module';
import { MapModule } from '@modules/maps/infra/restful-api/map.module';

@Module({
  imports: [
    UserModule,
    MapModule,
    MediaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService, ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
