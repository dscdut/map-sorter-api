import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticateGuard } from './modules/users/services/auth/guard/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AuthenticateGuard()
  getHello(): string {
    return this.appService.getHello();
  }
}
