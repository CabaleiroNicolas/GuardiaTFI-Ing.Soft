import { EstadoIngreso } from "../value-objects/estado-ingreso.enum";
import { NivelEmergencia } from "../value-objects/nivel-emergencia.enum";
import { SignosVitales } from "../value-objects/signos-vitales.vo";
import { Paciente } from "./paciente.entity";

export class Ingreso {
  private paciente: Paciente;
  private fechaIngreso: Date;
  private informe: string;
  private nivelEmergencia: NivelEmergencia;
  private signosVitales: SignosVitales;
  private estado: EstadoIngreso;

  constructor(paciente: Paciente, fechaIngreso: Date, informe: string, nivelEmergencia: NivelEmergencia, signosVitales: SignosVitales) {
    this.paciente = paciente;
    this.fechaIngreso = fechaIngreso;
    this.informe = informe;
    this.nivelEmergencia = nivelEmergencia;
    this.signosVitales = signosVitales;
    this.estado = EstadoIngreso.PENDIENTE;
  }

  getPaciente(): Paciente {
    return this.paciente;
  }

  getFechaIngreso(): Date {
    return this.fechaIngreso;
  }

  getInforme(): string {
    return this.informe;
  }

  getNivelEmergencia(): NivelEmergencia {
    return this.nivelEmergencia;
  }

  getSignosVitales(): SignosVitales {
    return this.signosVitales;
  }

  getEstado(): EstadoIngreso {
    return this.estado;
  }
}