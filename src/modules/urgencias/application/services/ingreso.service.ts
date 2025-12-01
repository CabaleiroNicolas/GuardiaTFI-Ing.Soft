import { Inject, Injectable } from "@nestjs/common";
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
import { UserRole } from "src/modules/user/domain/value-objects/user-role.enum";

@Injectable()
export class IngresoService implements IIngresoService {

  private readonly ordenNivelesEmergencia: NivelEmergencia[];
  private readonly NivelEmergenciaHelper = new NivelEmergenciaHelper();

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


  async registrar(ingreso: RegistrarIngresoDto, enfermeraId: number): Promise<string> {

    const enfermeraMock: Enfermera = new Enfermera(1,"","",UserRole.ENFERMERA, "20-44444444-1", "Stoessel", "Martina", "34");

    const paciente: Paciente = await this.validarPacienete(ingreso.cuil);

    const nuevoIngreso: Ingreso = new Ingreso(
      paciente,
      enfermeraMock,
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

    console.log("El ingreso se registró con éxito!");
    return "Ingreso registrado con éxito";
  }


  async obtenerIngresosEnEspera(): Promise<Ingreso[]> {
    let colaPacientes = await this.ingresoRepo.obtenerTodos(EstadoIngreso.PENDIENTE);
    return this.ordenarIngresosEnEspera(colaPacientes);
  }

  private ordenarIngresosEnEspera(colaIngresos: Ingreso[]) {
    return colaIngresos.sort((ingreso1, ingreso2) => {

      const nivel1 = this.ordenNivelesEmergencia.indexOf(ingreso1.getNivelEmergencia());
      const nivel2 = this.ordenNivelesEmergencia.indexOf(ingreso2.getNivelEmergencia());

      return nivel1 - nivel2;
    })
  }

  async validarPacienete(cuil: string): Promise<Paciente> {
    const paciente = await this.pacienteService.buscar(cuil);
    if (!paciente) {
      throw new Error("No se encontró el paciente");
    }
    return paciente;
  }

}