import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_SERVICIO, IAuthService } from '../application/ports/auth-service.interface';
import { AuthenticatedRequestVO } from '../domain/value-objects/authenticated-user.vo';

@Controller('auth')
export class AuthController {

    constructor(
        @Inject(AUTH_SERVICIO)
        private readonly authService: IAuthService
    ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() data: AuthenticatedRequestVO) {
    console.log("Nueva peticion de Login")
    return await this.authService.login(data.user);
  }
}

