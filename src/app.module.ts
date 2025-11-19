import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UrgenciasModule } from './modules/urgencias/urgencias.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    UrgenciasModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
