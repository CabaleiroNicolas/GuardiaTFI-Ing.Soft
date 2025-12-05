import { Inject, Injectable, Logger } from "@nestjs/common";
import { IMedicoService } from "../ports/medico-service.interface";
import { Medico } from "../../domain/entities/medico.entity";
import { IMedicoRepository, MEDICO_REPOSITORIO } from "../ports/medico-repository.interface";

@Injectable()
export class MedicoService implements IMedicoService {

    private readonly logger = new Logger(MedicoService.name);

    constructor(
        @Inject(MEDICO_REPOSITORIO)
        private readonly medicoRepository: IMedicoRepository,
    ) { }

    async buscarPorId(medicoId: number): Promise<Medico> {
        this.logger.log("Buscando medico por ID en servicio:");

        const medico: Medico | null = await this.medicoRepository.buscarPorId(medicoId);
        if (!medico) {
            this.logger.error("Medico no encontrado con ID:", medicoId);
            throw new Error('Medico no encontrado.');
        }
        return medico;
    }
}