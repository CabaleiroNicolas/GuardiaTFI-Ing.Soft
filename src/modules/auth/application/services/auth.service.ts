import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../ports/auth-service.interface';
import { IUserService, USER_SERVICIO } from 'src/modules/user/application/ports/user-service.interface';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @Inject(USER_SERVICIO)
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, rawPassword: string) {
    const user = await this.userService.findWithPasswordByEmail(email);
    if (!user) return null;

    const isValid: boolean = await bcrypt.compare(rawPassword, user.password!);
    if (!isValid) return null;

    const { password, ...safe } = user as User & { password?: string };
    return safe;
  }

  async login(user: User): Promise<any> {
    const payload = { id: user.userId, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}