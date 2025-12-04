import { Module } from "@nestjs/common";
import { PacientesController } from "./presentation/controllers/pacientes.controller";
import { PACIENTE_SERVICIO } from "./application/ports/paciente-service.interface";
import { PacienteService } from "./application/services/paciente.service";
import { PACIENTE_REPOSITORIO } from "./application/ports/paciente-repository.interface";
import { OBRASOCIAL_REPOSITORIO } from "./application/ports/obra-social-repository.interface";
import { ObraSocialRepositoryMock } from "test/mocks/obra-social-repository.mock";
import { AFILIADO_REPOSITORIO } from "./application/ports/afiliado-repository.interface";
import { AfiliadoRepositoryMock } from "test/mocks/afiliado-repository.mock";
import { PacienteRepositoryPg } from "./infrastructure/paciente.repository.pg";
import { ObraSocialRepositoryPg } from "./infrastructure/obra-social.repository.pg";
import { AfiliadoRepositoryPg } from "./infrastructure/afiliado.repository.pg";
import { OBRASOCIAL_SERVICIO } from "./application/ports/obra-social-service.interface";
import { ObraSocialService } from "./application/services/obra-social.service";
import { AFILIADO_SERVICIO } from "./application/ports/afiliado-service.interface";
import { AfiliadoService } from "./application/services/afiliado.service";

@Module({
  controllers: [PacientesController],
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