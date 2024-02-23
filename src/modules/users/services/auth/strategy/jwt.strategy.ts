import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@database/typeorm/entities';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { EntityManager } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly model: EntityManager,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const userModel = this.model.getRepository(User);
    const { userId } = payload;

    const user = await userModel.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
