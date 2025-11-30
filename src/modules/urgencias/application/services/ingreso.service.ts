import { Inject, Injectable } from "@nestjs/common";
import { Ingreso } from "../../domain/entities/ingreso.entity";
import { IIngresoService } from "../ports/ingreso-service.interface";
import { IIngresoRepository, INGRESO_REPOSITORIO } from "../ports/ingreso-repository.interface";
import { NivelEmergencia } from "../../domain/value-objects/nivel-emergencia.enum";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.enum";
import { RegistrarIngresoDto } from "../../domain/value-objects/registrar-ingreso.dto";
import { IPacienteService, PACIENTE_SERVICIO } from "src/modules/pacientes/application/ports/paciente-service.interface";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Enfermera } from "../../domain/entities/enfermera.entity";

@Injectable()
export class IngresoService implements IIngresoService {

  private readonly ordenNivelesEmergencia: NivelEmergencia[];

  constructor(
    @Inject(INGRESO_REPOSITORIO)
    private readonly ingresoRepo: IIngresoRepository,

    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService
  ) {
    this.ordenNivelesEmergencia = [NivelEmergencia.CRITICO, NivelEmergencia.EMERGENCIA, NivelEmergencia.URGENCIA, NivelEmergencia.URGENCIA_MENOR, NivelEmergencia.SIN_URGENCIA];
  }


  async registrar(ingreso: RegistrarIngresoDto, enfermera: Enfermera): Promise<string> {

    const paciente: Paciente = await this.validarPacienete(ingreso.cuil);

    const nuevoIngreso: Ingreso = new Ingreso(
      paciente,
      enfermera,
      new Date(Date.now()),
      ingreso.informe,
      NivelEmergencia[ingreso.nivelEmergencia],
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