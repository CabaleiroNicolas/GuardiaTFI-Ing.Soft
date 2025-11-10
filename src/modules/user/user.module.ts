import { Module } from '@nestjs/common';
import { UserController } from './infrastrucutre/user.controller';
import { UserService } from './application/services/user.service';
import { UserRepository } from './infrastrucutre/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { USER_SERVICIO } from './application/ports/user-service.interface';
import { USER_REPOSITORIO } from './application/ports/user-repository.interface';

@Module({
  controllers: [UserController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '2h',
      },
    }),],
  providers: [
    {
      provide: USER_SERVICIO,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORIO,
      useClass: UserRepository,
    }
  ],
  exports: [USER_SERVICIO],
})
export class UserModule {}
