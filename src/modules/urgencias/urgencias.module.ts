import { Module } from '@nestjs/common';
import { IngresoService } from './application/services/ingreso.service';
import { PacienteService } from './application/services/paciente.service';
import { INGRESO_REPOSITORIO } from './application/ports/ingreso-repository.interface';
import { IngresoRepositoryMock } from 'test/mocks/ingreso-repository.mock';
import { PACIENTE_REPOSITORIO } from './application/ports/paciente-repository.interface';
import { PacienteRepositoryMock } from 'test/mocks/paciente-repository.mock';
import { INGRESO_SERVICIO } from './application/ports/ingreso-service.interface';
import { PACIENTE_SERVICIO } from './application/ports/paciente-service.interface';

@Module({
    providers: [
        {
            provide: INGRESO_SERVICIO,
            useClass: IngresoService,
        },
        {
            provide: PACIENTE_SERVICIO,
            useClass: PacienteService,
        },
        {
            provide: INGRESO_REPOSITORIO,
            useClass: IngresoRepositoryMock, // Cambiar por IngresoRepositoryImpl cuando se implemente la real
        },
        {
            provide: PACIENTE_REPOSITORIO,
            useClass: PacienteRepositoryMock, // Cambiar por PacienteRepositoryImpl cuando se implemente la real
        },
        ],
    exports: [IngresoService, PacienteService],
})
export class UrgenciasModule {}
