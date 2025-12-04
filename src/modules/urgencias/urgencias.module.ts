import { Module } from '@nestjs/common';
import { IngresoService } from './application/services/ingreso.service';
import { INGRESO_REPOSITORIO } from './application/ports/ingreso-repository.interface';
import { INGRESO_SERVICIO } from './application/ports/ingreso-service.interface';
import { ENFERMERA_REPOSITORIO } from './application/ports/enfermera-repository.interface';
import { ENFERMERA_SERVICE } from './application/ports/enfermera-service.interface';
import { EnfermeraService } from './application/services/enfermera.service';
import { IngresoRepositoryPg } from './infrastructure/repositories/ingreso.repository.pg';
import { PacientesModule } from '../pacientes/pacientes.module';
import { UrgenciasController } from './infrastructure/urgencias.controller';
import { EnfermeraRepositoryPg } from './infrastructure/repositories/enfermera.repository.pg';
import { MEDICO_REPOSITORIO } from './application/ports/medico-repository.interface';
import { MEDICO_SERVICIO } from './application/ports/medico-service.interface';
import { MedicoRepositoryPg } from './infrastructure/repositories/medico.repository.pg';
import { MedicoService } from './application/services/medio.service';

@Module({
    controllers: [UrgenciasController],
    imports: [PacientesModule],
    providers: [
        {
            provide: INGRESO_SERVICIO,
            useClass: IngresoService,
        },
        {
            provide: INGRESO_REPOSITORIO,
            useClass: IngresoRepositoryPg,
        },
        {
            provide: ENFERMERA_SERVICE,
            useClass: EnfermeraService,
        },
        {
            provide: ENFERMERA_REPOSITORIO,
            useClass: EnfermeraRepositoryPg,
        },
        {
            provide: MEDICO_REPOSITORIO,
            useClass: MedicoRepositoryPg,
        },
        {
            provide: MEDICO_SERVICIO,
            useClass: MedicoService,
        },
    ],
    exports: [INGRESO_SERVICIO, ENFERMERA_SERVICE, MEDICO_SERVICIO]
})
export class UrgenciasModule { }
