import { IEnfermeraRepository } from "src/modules/urgencias/application/ports/enfermera-repository.interface";
import { Enfermera } from "src/modules/urgencias/domain/entities/enfermera.entity";

export class EnfermeraRepositoryMock  implements IEnfermeraRepository {

    private enfermeras: Enfermera[] = [];
    
    guardar(enfermera: Enfermera): Promise<void> {
        this.enfermeras.push(enfermera);
        return Promise.resolve();
    }

    obtenerTodos(): Promise<Enfermera[]> {
        return Promise.resolve(this.enfermeras);
    }
    
}