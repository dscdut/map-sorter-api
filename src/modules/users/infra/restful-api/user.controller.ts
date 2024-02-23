import { LoginWithGoogleCommand } from '@modules/users/usecases/login-with-google/login-with-google.command';
import {
  AuthGoogleLoginDto,
  AuthGoogleLoginDtoResponse,
} from '@modules/users/usecases/login-with-google/login-with-google.dto';
import {
  InvalidIdToken,
  UserProfileNotFound,
} from '@modules/users/usecases/login-with-google/login-with-google.errors';
import { LoginWithGoogleResponse } from '@modules/users/usecases/login-with-google/login-with-google.response';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('auth/google/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['users'],
    operationId: 'loginWithGoogle',
    summary: 'Login with Google',
    description: 'Login with Google',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AuthGoogleLoginDtoResponse,
  })
  async loginWithGoogle(
    @Body() loginDto: AuthGoogleLoginDto,
  ): Promise<AuthGoogleLoginDtoResponse> {
    const result = await this.commandBus.execute<
      LoginWithGoogleCommand,
      LoginWithGoogleResponse
    >(new LoginWithGoogleCommand(loginDto));

    if (result.isSuccess()) {
      return result.value.getValue();
    } else if (result.isFailure()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidIdToken:
        case UserProfileNotFound:
          throw new UnprocessableEntityException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }
  }
}
