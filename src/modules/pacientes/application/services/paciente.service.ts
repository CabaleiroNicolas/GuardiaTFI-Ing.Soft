
import { Paciente } from "../../domain/entities/paciente.entity";
import { IPacienteRepository, PACIENTE_REPOSITORIO } from "../ports/paciente-repository.interface";
import { IPacienteService } from "../ports/paciente-service.interface";
import { IObraSocialRepository, OBRASOCIAL_REPOSITORIO } from "../ports/obra-social-repository.interface";
import { AFILIADO_REPOSITORIO, IAfiliadoRepository } from "../ports/afiliado-repository.interface";
import { Afiliado } from "../../domain/value-objects/afiliado.vo";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { PacienteDto } from "../../domain/value-objects/paciente.dto";

@Injectable()
export class PacienteService implements IPacienteService {

  private readonly logger = new Logger(PacienteService.name);

  constructor(
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacienteRepo: IPacienteRepository,
    @Inject(OBRASOCIAL_REPOSITORIO)
    private readonly obraSocialRepo: IObraSocialRepository,
    @Inject(AFILIADO_REPOSITORIO)
    private readonly afiliadoRepo: IAfiliadoRepository
  ) { }

  async buscar(cuil: string): Promise<Paciente | null> {

    const paciente: Paciente | null = await this.pacienteRepo.obtener(cuil);

    if (!paciente) {
      this.logger.error("Paciente no encontrado con cuil:", cuil);
      throw new Error("No se encontró el Paciente");
    }
    return paciente;
  }



  async registrar(newPaciente: PacienteDto): Promise<void> {
    this.logger.log("Comenzando registro de paciente...");

    const pacienteExistente: Paciente | null = await this.pacienteRepo.obtener(newPaciente.cuil);
    if (pacienteExistente) {
      this.logger.error("El Paciente ya está registrado");
      throw new Error("El Paciente ya está registrado");
    }

    const paciente: Paciente = new Paciente(
      newPaciente.cuil,
      newPaciente.apellido,
      newPaciente.nombre,
      { calle: newPaciente.calle, numero: newPaciente.numero, localidad: newPaciente.localidad },
      null
    )

    await this.pacienteRepo.registrar(paciente);
  }



  async comprobarAfiliado(afiliado: Afiliado): Promise<void> {
    const obraSocial = afiliado.obraSocial;
    const afiliadoBuscado = await this.afiliadoRepo.obtener(afiliado.numeroAfiliado);

    if (!(await this.obraSocialRepo.obtener(obraSocial.getId()))) {
      throw new Error("Obra social inexistente");
    }

    if (afiliadoBuscado == null) {
      throw new Error("Número de afiliado inexistente");
    }

    if (afiliadoBuscado.obraSocial.getId() !== afiliado.obraSocial.getId()) {
      throw new Error("El paciente no está afiliado a la obra social");
    }
  }

  async modificar(paciente: Paciente): Promise<void> {
    throw new Error("No implementado");
  }

  async obtenerPacientesRegistrados(): Promise<Paciente[]> {
    return await this.pacienteRepo.obtenerTodos();
  }
}