import { Injectable } from "@nestjs/common";
import { Ingreso } from "../../domain/entities/ingreso.entity";
import { IIngresoService } from "../ports/ingreso-service.interface";
import { IIngresoRepository } from "../ports/ingreso-repository.interface";
import { NivelEmergencia } from "../../domain/value-objects/nivel-emergencia.vo";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.vo";

@Injectable()
export class IngresoService implements IIngresoService {

  private ingresoRepo: IIngresoRepository;
  private ordenNivelesEmergencia = [NivelEmergencia.CRITICO, NivelEmergencia.EMERGENCIA, NivelEmergencia.URGENCIA, NivelEmergencia.URGENCIA_MENOR, NivelEmergencia.SIN_URGENCIA];

  constructor(ingresoRepo: IIngresoRepository) {
    this.ingresoRepo = ingresoRepo;
  }

  comprobarCampos(ingreso: Ingreso): void {
    const { signosVitales, informe, nivelEmergencia } = ingreso;
    const { tensionArterial } = signosVitales;

    if (
      !signosVitales.temperatura ||
      !signosVitales.frecCardiaca ||
      !signosVitales.frecRespiratoria ||
      !tensionArterial ||
      !tensionArterial.frecSistolica ||
      !tensionArterial.frecDiastolica ||
      !informe ||
      !nivelEmergencia
    )
      throw new Error("Hay campos sin completar");

    if (signosVitales.frecCardiaca < 0)
      throw new Error("El valor de la frecuencia cardíaca no puede ser negativo");

    if (signosVitales.frecRespiratoria < 0)
      throw new Error("El valor de la frecuencia respiratoria no puede ser negativo");
  }

  obtenerIngresosEnEspera(): Ingreso[] {
    let colaPacientes = this.ingresoRepo.obtenerTodos(EstadoIngreso.PENDIENTE);
    return this.ordenarIngresosEnEspera(colaPacientes);
  }

  private ordenarIngresosEnEspera(colaIngresos: Ingreso[]) {
    return colaIngresos.sort((ingreso1, ingreso2) => { 

      const nivel1 = this.ordenNivelesEmergencia.indexOf(ingreso1.nivelEmergencia);
      const nivel2 = this.ordenNivelesEmergencia.indexOf(ingreso2.nivelEmergencia);

      return nivel1 - nivel2;
    })
  }

  registrar(ingreso: Ingreso): string {
    try {
      this.comprobarCampos(ingreso);
    }
    catch (error) {
      return `ERROR: ${error.message}`;
    }

    this.ingresoRepo.registrar(ingreso);

    return "El ingreso se registró con éxito!";
  }
}