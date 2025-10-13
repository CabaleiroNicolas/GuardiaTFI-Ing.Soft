import { setWorldConstructor } from "@cucumber/cucumber";
import { IngresoService } from "src/modules/urgencias/application/services/ingreso.service";
import { PacienteService } from "src/modules/urgencias/application/services/paciente.service";
import { Ingreso } from "src/modules/urgencias/domain/entities/ingreso.entity";
import { Paciente } from "src/modules/urgencias/domain/entities/paciente.entity";
import { Domicilio } from "src/modules/urgencias/domain/value-objects/domicilio.vo";
import { NivelEmergencia } from "src/modules/urgencias/domain/value-objects/nivel-emergencia.vo";
import { SignosVitales } from "src/modules/urgencias/domain/value-objects/signos-vitales.vo";
import { IngresoRepositoryMock } from "test/mocks/ingreso-repository.mock";
import { PacienteRepositoryMock } from "test/mocks/paciente-repository.mock";

export class CustomWorld {
  ingresoServicio: IngresoService;
  pacienteServicio: PacienteService;

  paciente: Paciente | null = null;
  ingreso: Ingreso | null = null;
  datosIngreso: any = null;
  informeMock = "Dolor de cabeza";
  nivelEmergencia: NivelEmergencia;
  signosVitalesMock: SignosVitales = {
    temperatura: 37,
    frecCardiaca: 120,
    frecRespiratoria: 12,
    tensionArterial: {
      frecSistolica: 120,
      frecDiastolica: 80
    }
  };
  domicilioMock: Domicilio = {
    calle: "Calle random",
    numero: 123,
    localidad: "San Miguel de Tucumán"
  }

  constructor() {
    const ingresoRepo = new IngresoRepositoryMock();
    const pacienteRepo = new PacienteRepositoryMock();

    this.ingresoServicio = new IngresoService(ingresoRepo);
    this.pacienteServicio = new PacienteService(pacienteRepo);
  }

  reset(): void {
    this.paciente = null;
    this.ingreso = null;
    this.datosIngreso = null;
  }
}

setWorldConstructor(CustomWorld);