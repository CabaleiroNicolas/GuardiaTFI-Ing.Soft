import { Module } from '@nestjs/common';
import { IngresoService } from './application/services/ingreso.service';
import { INGRESO_REPOSITORIO } from './application/ports/ingreso-repository.interface';
import { INGRESO_SERVICIO } from './application/ports/ingreso-service.interface';
import { ENFERMERA_REPOSITORIO } from './application/ports/enfermera-repository.interface';
import { ENFERMERA_SERVICE } from './application/ports/enfermera-service.interface';
import { EnfermeraService } from './application/services/enfermera.service';
import { EnfermeraRepositoryMock } from 'test/mocks/enfermera-repository.mock';
import { IngresoRepositoryPg } from './infrastructure/repositories/ingreso.repository.pg';
import { PacientesModule } from '../pacientes/pacientes.module';
import { UrgenciasController } from './infrastructure/urgencias.controller';

@Module({
    controllers: [UrgenciasController],
    imports: [PacientesModule],
    providers: [
        {
            provide: INGRESO_SERVICIO,
            useClass: IngresoService,
        },
        {
            provide: ENFERMERA_SERVICE,
            useClass: EnfermeraService,
        },
        {
            provide: INGRESO_REPOSITORIO,
            useClass: IngresoRepositoryPg,
        },
        {
            provide: ENFERMERA_REPOSITORIO,
            useClass: EnfermeraRepositoryMock,
        },
    ],
    exports: [INGRESO_SERVICIO, ENFERMERA_SERVICE]
})
export class UrgenciasModule { }
