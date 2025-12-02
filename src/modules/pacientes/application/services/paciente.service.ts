import { Paciente } from "../../domain/entities/paciente.entity";
import { IPacienteRepository, PACIENTE_REPOSITORIO } from "../ports/paciente-repository.interface";
import { IPacienteService } from "../ports/paciente-service.interface";
import { Afiliado } from "../../domain/value-objects/afiliado.vo";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { PacienteDto } from "../../domain/value-objects/paciente.dto";
import { ObraSocial } from "../../domain/entities/obra-social.entity";
import { IObraSocialService, OBRASOCIAL_SERVICIO } from "../ports/obra-social-service.interface";
import { AFILIADO_SERVICIO, IAfiliadoService } from "../ports/afiliado-service.interface";

@Injectable()
export class PacienteService implements IPacienteService {

  private readonly logger = new Logger(PacienteService.name);

  constructor(
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacienteRepo: IPacienteRepository,
    @Inject(OBRASOCIAL_SERVICIO)
    private readonly obraSocialServ: IObraSocialService,
    @Inject(AFILIADO_SERVICIO)
    private readonly afiliadoServ: IAfiliadoService
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

    this.comprobarCampos(newPaciente);

    const pacienteExistente: Paciente | null = await this.pacienteRepo.obtener(newPaciente.cuil);
    if (pacienteExistente) {
      this.logger.error("El Paciente ya está registrado");
      throw new Error("El Paciente ya está registrado");
    }

    if (newPaciente.numeroAfiliado && newPaciente.obraSocial) {
      const afiliado: Afiliado = {
        numeroAfiliado: newPaciente.numeroAfiliado,
        obraSocial: new ObraSocial("", newPaciente.obraSocial)
      };

      await this.comprobarAfiliado(afiliado);
    }

    const afiliado = !newPaciente.numeroAfiliado
      ? await this.afiliadoServ.buscar(newPaciente.numeroAfiliado)
      : null;

    const paciente: Paciente = new Paciente(
      newPaciente.cuil,
      newPaciente.apellido,
      newPaciente.nombre,
      { calle: newPaciente.calle, numero: newPaciente.numero, localidad: newPaciente.localidad },
      afiliado
    )

    await this.pacienteRepo.registrar(paciente);
  }

  private comprobarCampos(paciente: PacienteDto) {
    if (!paciente.cuil) {
      throw new Error("El campo cuil no puede estar vacío");
    }

    if (!/^(20|27)\d{8}\d$/.test(paciente.cuil)) {
      throw new Error("Formato de CUIL incorrecto");
    }

    if (!paciente.nombre) {
      throw new Error("El campo nombre no puede estar vacío");
    }

    if (!paciente.apellido) {
      throw new Error("El campo apellido no puede estar vacío");
    }

    if (!paciente.calle) {
      throw new Error("El campo calle no puede estar vacío");
    }

    if (!paciente.numero) {
      throw new Error("El campo numero no puede estar vacío");
    }

    if (!paciente.localidad) {
      throw new Error("El campo localidad no puede estar vacío");
    }
  }

  async comprobarAfiliado(afiliado: Afiliado): Promise<void> {
    const obraSocial = await this.obraSocialServ.buscar(afiliado.obraSocial.getNombre());
    const afiliadoBuscado = await this.afiliadoServ.buscar(afiliado.numeroAfiliado);

    if (obraSocial == null) {
      throw new Error("Obra social inexistente");
    }

    if (afiliadoBuscado == null) {
      throw new Error("Número de afiliado inexistente");
    }

    if (afiliadoBuscado.obraSocial.getId() !== obraSocial.getId()) {
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