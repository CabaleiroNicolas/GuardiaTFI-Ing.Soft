import { Module } from "@nestjs/common";
import { PACIENTE_SERVICIO } from "./application/ports/paciente-service.interface";
import { PacienteService } from "./application/services/paciente.service";
import { PACIENTE_REPOSITORIO } from "./application/ports/paciente-repository.interface";
import { OBRASOCIAL_REPOSITORIO } from "./application/ports/obra-social-repository.interface";
import { AFILIADO_REPOSITORIO } from "./application/ports/afiliado-repository.interface";
import { OBRASOCIAL_SERVICIO } from "./application/ports/obra-social-service.interface";
import { ObraSocialService } from "./application/services/obra-social.service";
import { AFILIADO_SERVICIO } from "./application/ports/afiliado-service.interface";
import { AfiliadoService } from "./application/services/afiliado.service";
import { PacientesController } from "./infrastructure/controller/pacientes.controller";
import { PacienteRepositoryPg } from "./infrastructure/repository/paciente.repository.pg";
import { ObraSocialRepositoryPg } from "./infrastructure/repository/obra-social.repository.pg";
import { AfiliadoRepositoryPg } from "./infrastructure/repository/afiliado.repository.pg";
import { ObraSocialController } from "./infrastructure/controller/obra-social.controller";

@Module({
  controllers: [PacientesController, ObraSocialController],
  providers: [
    {
      provide: PACIENTE_SERVICIO,
      useClass: PacienteService
    },
    {
      provide: PACIENTE_REPOSITORIO,
      useClass: PacienteRepositoryPg
    },
    {
      provide: OBRASOCIAL_SERVICIO,
      useClass: ObraSocialService
    },
    {
      provide: OBRASOCIAL_REPOSITORIO,
      useClass: ObraSocialRepositoryPg
    },
    {
      provide: AFILIADO_SERVICIO,
      useClass: AfiliadoService
    },
    {
      provide: AFILIADO_REPOSITORIO,
      useClass: AfiliadoRepositoryPg
    }
  ],
  exports: [PACIENTE_SERVICIO, OBRASOCIAL_SERVICIO, AFILIADO_SERVICIO]
})
export class PacientesModule { }