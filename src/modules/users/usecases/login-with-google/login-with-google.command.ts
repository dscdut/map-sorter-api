import { AuthGoogleLoginDto } from './login-with-google.dto';

export class LoginWithGoogleCommand {
  constructor(public readonly loginDto: AuthGoogleLoginDto) {}
}
