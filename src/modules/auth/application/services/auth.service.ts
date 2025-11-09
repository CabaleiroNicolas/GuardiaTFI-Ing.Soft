import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../ports/auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
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

  async login(user: Pick<User, 'userId' | 'email'>) {
    const payload = { id: user.userId, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}