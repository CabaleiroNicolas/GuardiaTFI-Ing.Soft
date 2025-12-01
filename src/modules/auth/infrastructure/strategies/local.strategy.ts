import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AUTH_SERVICIO, IAuthService } from '../../application/ports/auth-service.interface';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_SERVICIO)
    private readonly authService: IAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log("Estrategia Local - Validate");
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    return user;
  }
}
