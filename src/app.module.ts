import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UrgenciasModule } from './modules/urgencias/urgencias.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    UrgenciasModule,
    PacientesModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
})
export class AppModule { }
