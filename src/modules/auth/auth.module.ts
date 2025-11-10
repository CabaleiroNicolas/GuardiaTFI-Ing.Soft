import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AUTH_SERVICIO } from './application/ports/auth-service.interface';
import { AuthService } from './application/services/auth.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [
    {
      provide: AUTH_SERVICIO,
      useClass: AuthService,
    }
  ],
  imports: [UserModule],
  controllers: [AuthController]
})
export class AuthModule { }
