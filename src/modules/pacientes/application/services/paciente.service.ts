
import { Paciente } from "../../domain/entities/paciente.entity";
import { IPacienteRepository, PACIENTE_REPOSITORIO } from "../ports/paciente-repository.interface";
import { IPacienteService } from "../ports/paciente-service.interface";
import { IObraSocialRepository, OBRASOCIAL_REPOSITORIO } from "../ports/obra-social-repository.interface";
import { AFILIADO_REPOSITORIO, IAfiliadoRepository } from "../ports/afiliado-repository.interface";
import { Afiliado } from "../../domain/value-objects/afiliado.vo";
import { Inject, Injectable } from "@nestjs/common";
import { PacienteDto } from "../../domain/value-objects/paciente.dto";

@Injectable()
export class PacienteService implements IPacienteService {

  constructor(
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacienteRepo: IPacienteRepository,
    @Inject(OBRASOCIAL_REPOSITORIO)
    private readonly obraSocialRepo: IObraSocialRepository,
    @Inject(AFILIADO_REPOSITORIO)
    private readonly afiliadoRepo: IAfiliadoRepository
  ) { }

  async buscar(cuil: string): Promise<Paciente | null> {
    return await this.pacienteRepo.obtener(cuil);
  }

  async comprobarCampos(paciente: Paciente): Promise<void> {
    const cuil = paciente.getCuil();
    const apellido = paciente.getApellido();
    const nombre = paciente.getNombre();
    const domicilio = paciente.getDomicilio();
    const afiliado = paciente.getObraSocial();

    if (!cuil)
      throw new Error("El campo cuit no puede estar vacío");

    if (!apellido)
      throw new Error("El campo apellido no puede estar vacío");

    if (!nombre)
      throw new Error("El campo nombre no puede estar vacío");

    if (!domicilio.calle)
      throw new Error("El campo calle no puede estar vacío");

    if (!domicilio.localidad)
      throw new Error("El campo localidad no puede estar vacío");

    if (!domicilio.numero)
      throw new Error("El campo numero no puede estar vacío");

    if (!/^(20|27)-\d{8}-\d$/.test(cuil))
      throw new Error("Formato de CUIL incorrecto");

    if (afiliado != null)
      await this.comprobarAfiliado(afiliado)
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

  async registrar(newPaciente: PacienteDto): Promise<void> {
    console.log("Comenzando registro de paciente...");
    const paciente: Paciente = new Paciente(
      newPaciente.cuil,
      newPaciente.apellido,
      newPaciente.nombre,
      { calle: newPaciente.calle, numero: newPaciente.numero, localidad: newPaciente.localidad },
      null
    )

    try {
      await this.pacienteRepo.registrar(paciente);
    }
    catch (error) {
      console.log("Error al registrar paciente:", error);
      throw new Error(`ERROR: ${error.message}`)
    }
  }
}