import { Inject, Injectable } from '@nestjs/common';
import { ENFERMERA_REPOSITORIO, IEnfermeraRepository } from '../ports/enfermera-repository.interface';
import { IEnfermeraService } from '../ports/enfermera-service.interface';
import { Enfermera } from '../../domain/entities/enfermera.entity';

@Injectable()
export class EnfermeraService implements IEnfermeraService {

    constructor(
        @Inject(ENFERMERA_REPOSITORIO)
        private readonly enfermeraRepository: IEnfermeraRepository,
    ) {}

    
    async buscarPorId(enfermeraId: number): Promise<Enfermera> {
        console.log("Buscando enfermera por ID en servicio:", enfermeraId);
        const enfermera: Enfermera | null = await this.enfermeraRepository.buscarPorId(enfermeraId);
        if(!enfermera){
            throw new Error('Enfermera no encontrada.');
        }
        return enfermera;
    }


    async registrar(enfermera: Enfermera): Promise<void> {
        const enfermeras: Enfermera[] = await this.enfermeraRepository.obtenerTodos();
        const existe = enfermeras.some(e => e.getCuil() === enfermera.getCuil());
        if (existe) {
            throw new Error('La enfermera ya está registrada.');
        }
        await this.enfermeraRepository.guardar(enfermera);
    }



}
