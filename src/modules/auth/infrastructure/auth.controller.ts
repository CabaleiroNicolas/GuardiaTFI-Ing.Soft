import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IAuthService } from '../application/ports/auth-service.interface';
import { AuthenticatedRequestVO } from '../domain/value-objects/authenticated-user.vo';

@Controller('auth')
export class AuthController {

    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: IAuthService
    ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() data: AuthenticatedRequestVO) {
    return await this.authService.login(data.user);
  }
}

