import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from '@shared/services/api-config.service';
import { UserController } from './user.controller';
import { LoginWithGoogleUseCase } from '@modules/users/usecases/login-with-google/login-with-google.usecase';
import { TypeOrmUserRepository } from '@modules/users/repos/implementations/typeorm.user.repository';
import { OAuthService } from '@modules/users/services/auth/providers/google/oauth.service';
import { JwtStrategy } from '@modules/users/services/auth/strategy/jwt.strategy';

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
  controllers: [UserController],
  providers: [
    LoginWithGoogleUseCase,
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    OAuthService,
    JwtStrategy,
  ],
  exports: ['IUserRepository', OAuthService, PassportModule],
})
export class UserModule {}
