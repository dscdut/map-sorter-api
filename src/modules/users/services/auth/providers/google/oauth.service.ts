import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UserProfileInfo } from '../../interface/user-profile-info.interface';

@Injectable()
export class OAuthService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.google = new OAuth2Client(
      configService.get('GOOGLE_CLIENT_ID'),
      configService.get('GOOGLE_CLIENT_SECRET'),
      configService.get('GOOGLE_CALLBACK_URL'),
    );
  }

  async validate(idToken: string): Promise<boolean> {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: idToken,
        audience: [
          this.configService.getOrThrow('GOOGLE_CLIENT_ID', { infer: true }),
        ],
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserProfileInfo(idToken: string): Promise<UserProfileInfo> {
    const ticket = await this.google.verifyIdToken({
      idToken: idToken,
      audience: [
        this.configService.getOrThrow('GOOGLE_CLIENT_ID', { infer: true }),
      ],
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('User profile not found');
    }

    return {
      sub_id: payload.sub,
      email: payload.email,
      fullName: payload.name,
      avatar: payload.picture,
    };
  }
}
