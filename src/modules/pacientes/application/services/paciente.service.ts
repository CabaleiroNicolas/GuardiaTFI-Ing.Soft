import { Inject, Injectable } from "@nestjs/common";
import { Paciente } from "../../domain/entities/paciente.entity";
import { IPacienteRepository, PACIENTE_REPOSITORIO } from "../ports/paciente-repository.interface";
import { IPacienteService } from "../ports/paciente-service.interface";
import { IObraSocialRepository } from "../ports/obra-social-repository.interface";

@Injectable()
export class PacienteService implements IPacienteService {
  
    constructor(
      @Inject(PACIENTE_REPOSITORIO)
      private readonly pacienteRepo: IPacienteRepository,
      private readonly obraSocialRepo: IObraSocialRepository
    ) {}
    
    buscar(cuil: string): Paciente | null {
      return this.pacienteRepo.obtener(cuil);
    }
  
    comprobarCampos(paciente: Paciente): void {
      const cuil = paciente.getCuil();
      const apellido = paciente.getApellido();
      const nombre = paciente.getNombre();
      const domicilio = paciente.getDomicilio();
      const afiliado = paciente.getObraSocial();
  
      if (
        !cuil ||
        !apellido ||
        !nombre ||
        !domicilio ||
        !domicilio.calle ||
        !domicilio.localidad ||
        !domicilio.numero
      )
        throw new Error("Hay campos sin completar");
      
      if (!cuil.match('^(20|27)-[0-9]{8}-[0-9]$'))
        throw new Error("Formato de CUIL incorrecto");
      
      if (afiliado != null) {
        const obraSocial = afiliado.obraSocial;
        const numeroAfiliadoParseado = Number(afiliado.numeroAfiliado);

        if (numeroAfiliadoParseado < 0)
          throw new Error("El valor del número de afiliado no puede ser negativo");

        if (!this.obraSocialRepo.obtener(obraSocial.getId())) {
          throw new Error("Obra social inexistente");
        }
      }
    }
  
    modificar(paciente: Paciente): boolean {
      throw new Error("No implementado");
    }
  
    obtenerPacientesRegistrados(): Paciente[] {
      return this.pacienteRepo.obtenerTodos();
    }
  
    registrar(paciente: Paciente): void {
      try {
        this.comprobarCampos(paciente);
        this.pacienteRepo.registrar(paciente);
      }
      catch (error) {
        throw new Error(`ERROR: ${error.message}`)
      }
    }
}