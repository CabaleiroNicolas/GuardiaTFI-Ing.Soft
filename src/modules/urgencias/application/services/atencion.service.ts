import { Inject, Injectable } from "@nestjs/common";
import { IAtencionService } from "../ports/atencion-service.interface";
import { ATENCION_REPOSITORIO, IAtencionRepository } from "../ports/atencion-repository.interface";
import { RegistrarAtencionDto } from "../../domain/value-objects/registrar-atencion.dto";
import { IMedicoService, MEDICO_SERVICIO } from "../ports/medico-service.interface";
import { Medico } from "../../domain/entities/medico.entity";
import { IIngresoService, INGRESO_SERVICIO } from "../ports/ingreso-service.interface";
import { Atencion } from "../../domain/entities/atencion.entity";
import { AtencionDto } from "../../domain/value-objects/atencion.dto";

@Injectable()
export class AtencionService implements IAtencionService {

    constructor(
        @Inject(ATENCION_REPOSITORIO)
        private readonly atencionRepository: IAtencionRepository,
        @Inject(MEDICO_SERVICIO)
        private readonly medicoService: IMedicoService,
        @Inject(INGRESO_SERVICIO)
        private readonly ingresoService: IIngresoService,
    ) { }

    async registrarAtencion(atencionDto: RegistrarAtencionDto, medicoId: number): Promise<void> {

        const medico: Medico = await this.medicoService.buscarPorId(medicoId);
        const atencion: Atencion = new Atencion(atencionDto.informe, medico);

        const atencionId: number = await this.atencionRepository.registrarAtencion(atencion);
        await this.ingresoService.marcarAtendido(atencionDto.ingresoId, atencionId);
    }

    async obtenerAtenciones(): Promise<AtencionDto[]> {
        return await this.atencionRepository.obtenerAtenciones();
    }
}