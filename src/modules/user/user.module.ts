import { Module } from '@nestjs/common';
import { UserController } from './infrastrucutre/user.controller';
import { UserService } from './application/services/user.service';
import { UserRepository } from './infrastrucutre/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    }
  ]
})
export class UserModule {}
