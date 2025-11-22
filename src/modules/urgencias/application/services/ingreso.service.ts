import { Inject, Injectable } from "@nestjs/common";
import { Ingreso } from "../../domain/entities/ingreso.entity";
import { IIngresoService } from "../ports/ingreso-service.interface";
import { IIngresoRepository, INGRESO_REPOSITORIO } from "../ports/ingreso-repository.interface";
import { NivelEmergencia } from "../../domain/value-objects/nivel-emergencia.enum";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.enum";

@Injectable()
export class IngresoService implements IIngresoService {

  private readonly ordenNivelesEmergencia: NivelEmergencia[];

  constructor(
    @Inject(INGRESO_REPOSITORIO)
    private readonly ingresoRepo: IIngresoRepository
  ) {
    this.ordenNivelesEmergencia = [NivelEmergencia.CRITICO, NivelEmergencia.EMERGENCIA, NivelEmergencia.URGENCIA, NivelEmergencia.URGENCIA_MENOR, NivelEmergencia.SIN_URGENCIA];
  }

  
  comprobarCampos(ingreso: Ingreso): void {
    const signosVitales = ingreso.getSignosVitales();
    const informe = ingreso.getInforme();
    const nivelEmergencia = ingreso.getNivelEmergencia();
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

  async registrar(ingreso: Ingreso): Promise<string> {
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