import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginWithGoogleCommand } from './login-with-google.command';
import { LoginWithGoogleResponse } from './login-with-google.response';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '@modules/users/repos/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from '@modules/users/services/auth/providers/google/oauth.service';
import {
  InvalidIdToken,
  UserProfileNotFound,
} from './login-with-google.errors';
import { Result, failure, success } from '@core/logic/errors-handler';
import { UserProfileInfo } from '@modules/users/services/auth/interface/user-profile-info.interface';
import { AuthGoogleLoginDtoResponse } from './login-with-google.dto';
import { User } from '@modules/users/domain/user';
import { UnexpectedError } from '@core/logic/application-error';

@CommandHandler(LoginWithGoogleCommand)
export class LoginWithGoogleUseCase
  implements ICommandHandler<LoginWithGoogleCommand, LoginWithGoogleResponse>
{
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly oauthService: OAuthService,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    loginDto,
  }: LoginWithGoogleCommand): Promise<LoginWithGoogleResponse> {
    const { idToken } = loginDto;
    const isValidToken = await this.oauthService.validate(idToken);

    if (!isValidToken) {
      return failure(new InvalidIdToken());
    }

    let userProfileInfo: UserProfileInfo;
    try {
      userProfileInfo = await this.oauthService.getUserProfileInfo(idToken);
    } catch (error) {
      return failure(new UserProfileNotFound());
    }

    const isUserRegistered = await this.userRepository.findOneBy({
      email: userProfileInfo.email,
    });

    let token: string;
    let user: User;
    if (isUserRegistered) {
      user = isUserRegistered;
      token = this.jwtService.sign({ id: isUserRegistered.id });
    } else {
      const userOrError: Result<User> = User.create({
        email: userProfileInfo.email,
        fullName: userProfileInfo.fullName,
        avatar: userProfileInfo.avatar,
      });

      if (userOrError.isFailed) {
        return failure(new UnexpectedError('Failed to create user'));
      }

      user = userOrError.getValue();
      await this.userRepository.save(user);

      token = this.jwtService.sign({
        userId: user.id.getStringValue(),
        email: user.email,
      });
    }

    return success(
      Result.ok<AuthGoogleLoginDtoResponse>({
        email: user.email,
        accessToken: token,
      }),
    );
  }
}
