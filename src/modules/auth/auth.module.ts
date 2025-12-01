import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AUTH_SERVICIO } from './application/ports/auth-service.interface';
import { AuthService } from './application/services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  providers: [
    LocalStrategy,
    JwtStrategy,
    {
      provide: AUTH_SERVICIO,
      useClass: AuthService,
    }
  ],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  exports: [AUTH_SERVICIO],
  controllers: [AuthController]
})
export class AuthModule { }
