import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AUTH_SERVICIO } from './application/ports/auth-service.interface';
import { AuthService } from './application/services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [
    {
      provide: AUTH_SERVICIO,
      useClass: AuthService,
    }
  ],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  exports: [AUTH_SERVICIO],
  controllers: [AuthController]
})
export class AuthModule { }
