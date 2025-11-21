import { Module } from "@nestjs/common";
import { PacientesController } from "./presentation/controllers/pacientes.controller";
import { PACIENTE_SERVICIO } from "./application/ports/paciente-service.interface";
import { PacienteService } from "./application/services/paciente.service";
import { PACIENTE_REPOSITORIO } from "./application/ports/paciente-repository.interface";
import { PacienteRepositoryMock } from "test/mocks/paciente-repository.mock";
import { OBRASOCIAL_REPOSITORIO } from "./application/ports/obra-social-repository.interface";
import { ObraSocialRepositoryMock } from "test/mocks/obra-social-repository.mock";
import { AFILIADO_REPOSITORIO } from "./application/ports/afiliado-repository.interface";
import { AfiliadoRepositoryMock } from "test/mocks/afiliado-repository.mock";

@Module({
  controllers: [PacientesController],
  providers: [
    {
      provide: PACIENTE_SERVICIO,
      useClass: PacienteService
    },
    {
      provide: PACIENTE_REPOSITORIO,
      useClass: PacienteRepositoryMock
    },
    {
      provide: OBRASOCIAL_REPOSITORIO,
      useClass: ObraSocialRepositoryMock
    },
    {
      provide: AFILIADO_REPOSITORIO,
      useClass: AfiliadoRepositoryMock
    }
  ],
  exports: [PACIENTE_SERVICIO]
})
export class PacientesModule { }