import { Module } from '@nestjs/common';
import { IngresoService } from './application/services/ingreso.service';
import { PacienteService } from '../pacientes/application/services/paciente.service';
import { INGRESO_REPOSITORIO } from './application/ports/ingreso-repository.interface';
import { IngresoRepositoryMock } from 'test/mocks/ingreso-repository.mock';
// import { PACIENTE_REPOSITORIO } from './application/ports/paciente-repository.interface';
import { PacienteRepositoryMock } from 'test/mocks/paciente-repository.mock';
import { INGRESO_SERVICIO } from './application/ports/ingreso-service.interface';
// import { PACIENTE_SERVICIO } from './application/ports/paciente-service.interface';
import { ENFERMERA_REPOSITORIO } from './application/ports/enfermera-repository.interface';
import { ENFERMERA_SERVICE } from './application/ports/enfermera-service.interface';
import { EnfermeraService } from './application/services/enfermera.service';
import { EnfermeraRepositoryMock } from 'test/mocks/enfermera-repository.mock';

@Module({
    providers: [
        {
            provide: INGRESO_SERVICIO,
            useClass: IngresoService,
        },
        // {
        //     provide: PACIENTE_SERVICIO,
        //     useClass: PacienteService,
        // },
        {
            provide: ENFERMERA_SERVICE,
            useClass: EnfermeraService,
        },
        {
            provide: INGRESO_REPOSITORIO,
            useClass: IngresoRepositoryMock, // Cambiar por IngresoRepositoryImpl cuando se implemente la real
        },
        // {
        //     provide: PACIENTE_REPOSITORIO,
        //     useClass: PacienteRepositoryMock, // Cambiar por PacienteRepositoryImpl cuando se implemente la real
        // },
        // {
        //     provide: ENFERMERA_REPOSITORIO,
        //     useClass: EnfermeraRepositoryMock, // Cambiar por EnfermeraRepositoryImpl cuando se implemente la real
        // }
    ],
    exports: [IngresoService, PacienteService, EnfermeraService],
})
export class UrgenciasModule { }
