import { Inject, Injectable, Logger } from "@nestjs/common";
import { Ingreso } from "../../domain/entities/ingreso.entity";
import { IIngresoService } from "../ports/ingreso-service.interface";
import { IIngresoRepository, INGRESO_REPOSITORIO } from "../ports/ingreso-repository.interface";
import { NivelEmergencia, NivelEmergenciaHelper } from "../../domain/value-objects/nivel-emergencia.enum";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.enum";
import { RegistrarIngresoDto } from "../../domain/value-objects/registrar-ingreso.dto";
import { IPacienteService, PACIENTE_SERVICIO } from "src/modules/pacientes/application/ports/paciente-service.interface";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Enfermera } from "../../domain/entities/enfermera.entity";
import { ENFERMERA_SERVICE, IEnfermeraService } from "../ports/enfermera-service.interface";

@Injectable()
export class IngresoService implements IIngresoService {

  private readonly ordenNivelesEmergencia: NivelEmergencia[];
  private readonly logger = new Logger(IngresoService.name);

  constructor(
    @Inject(INGRESO_REPOSITORIO)
    private readonly ingresoRepo: IIngresoRepository,

    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService,

    @Inject(ENFERMERA_SERVICE)
    private readonly enfermeraService: IEnfermeraService,
  ) {
    this.ordenNivelesEmergencia = [NivelEmergencia.CRITICO, NivelEmergencia.EMERGENCIA, NivelEmergencia.URGENCIA, NivelEmergencia.URGENCIA_MENOR, NivelEmergencia.SIN_URGENCIA];
  }

  // Para validar paso Then
  private comprobarCampos(ingreso: RegistrarIngresoDto) {

    if (!ingreso.temperatura || !ingreso.frecCardiaca || !ingreso.frecRespiratoria)
      throw new Error("Hay campos sin completar");

    if (ingreso.temperatura < 0)
      throw new Error("El valor de la temperatura no puede ser negativo");

    if (ingreso.frecCardiaca < 0)
      throw new Error("El valor de la frecuencia cardíaca no puede ser negativo");

    if (ingreso.frecRespiratoria < 0)
      throw new Error("El valor de la frecuencia respiratoria no puede ser negativo");
  }


  async registrar(ingreso: RegistrarIngresoDto, enfermeraId: number): Promise<void> {

    try {
      this.comprobarCampos(ingreso);
    } catch (error) {
      throw new Error("ERROR: " + error.message);
    }

    const enfermera: Enfermera = await this.enfermeraService.buscarPorId(enfermeraId);

    const paciente: Paciente = await this.validarPacienete(ingreso.cuil);

    const nuevoIngreso: Ingreso = new Ingreso(
      paciente,
      enfermera,
      new Date(Date.now()),
      ingreso.informe,
      NivelEmergenciaHelper.nivelEmergenciaFromString(ingreso.nivelEmergencia),
      {
        temperatura: ingreso.temperatura,
        frecCardiaca: ingreso.frecCardiaca,
        frecRespiratoria: ingreso.frecRespiratoria,
        tensionArterial: {
          frecSistolica: Number(ingreso.tensionArterial.split('/')[0]),
          frecDiastolica: Number(ingreso.tensionArterial.split('/')[1])
        }
      }
    )
    await this.ingresoRepo.registrar(nuevoIngreso);

    this.logger.log("El ingreso se registró con éxito!");
  }


  async obtenerIngresosEnEspera(): Promise<Ingreso[]> {
    let colaPacientes: Ingreso[] = await this.ingresoRepo.obtenerTodos(EstadoIngreso.PENDIENTE);
    return this.ordenarIngresosEnEspera(colaPacientes);
  }

  async reclamarPaciente(): Promise<Ingreso> {
    const ingresosEnEspera: Ingreso[] = await this.obtenerIngresosEnEspera();
    if (ingresosEnEspera.length === 0) {
      throw new Error("No hay pacientes en espera para ser reclamados");
    }

    const ingresoReclamado: Ingreso = ingresosEnEspera[0];
    await this.ingresoRepo.modificarEstado(ingresoReclamado.getId(), EstadoIngreso.EN_PROCESO);
    return ingresoReclamado;
  }

  async traerUltimoReclamado(): Promise<Ingreso> {
    return (await this.ingresoRepo.obtenerTodos(EstadoIngreso.EN_PROCESO))[0];
  }


  private ordenarIngresosEnEspera(colaIngresos: Ingreso[]) {
    return colaIngresos.sort((ingreso1, ingreso2) => {

      const nivel1 = this.ordenNivelesEmergencia.indexOf(ingreso1.getNivelEmergencia());
      const nivel2 = this.ordenNivelesEmergencia.indexOf(ingreso2.getNivelEmergencia());

      const diferenciaPrioridad = nivel1 - nivel2;

      if (diferenciaPrioridad !== 0) {
        return diferenciaPrioridad;
      }

      const fecha1 = new Date(ingreso1.getFechaIngreso()).getTime();
      const fecha2 = new Date(ingreso2.getFechaIngreso()).getTime();

      return fecha1 - fecha2;
    });
  }

  private async validarPacienete(cuil: string): Promise<Paciente> {
    console.log("Validando paciente con cuil:", cuil);
    const paciente = await this.pacienteService.buscar(cuil);

    const ingresoPendiente = (await this.obtenerIngresosEnEspera()).find(ingreso => ingreso.getPaciente().getCuil() === cuil);
    if (ingresoPendiente) {
      throw new Error("El Paciente ya tiene un ingreso pendiente");
    }
    return paciente!;
  }

}