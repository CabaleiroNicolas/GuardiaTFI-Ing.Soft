import { setWorldConstructor } from "@cucumber/cucumber";
import { IEnfermeraService } from "src/modules/urgencias/application/ports/enfermera-service.interface";
import { IIngresoService } from "src/modules/urgencias/application/ports/ingreso-service.interface";
import { IPacienteService } from "src/modules/urgencias/application/ports/paciente-service.interface";
import { EnfermeraService } from "src/modules/urgencias/application/services/enfermera.service";
import { IngresoService } from "src/modules/urgencias/application/services/ingreso.service";
import { PacienteService } from "src/modules/urgencias/application/services/paciente.service";
import { Enfermera } from "src/modules/urgencias/domain/entities/enfermera.entity";
import { Ingreso } from "src/modules/urgencias/domain/entities/ingreso.entity";
import { ObraSocial } from "src/modules/urgencias/domain/entities/obra-social.entity";
import { Paciente } from "src/modules/urgencias/domain/entities/paciente.entity";
import { Afiliado } from "src/modules/urgencias/domain/value-objects/afiliado.vo";
import { Domicilio } from "src/modules/urgencias/domain/value-objects/domicilio.vo";
import { NivelEmergencia } from "src/modules/urgencias/domain/value-objects/nivel-emergencia.enum";
import { SignosVitales } from "src/modules/urgencias/domain/value-objects/signos-vitales.vo";
import { EnfermeraRepositoryMock } from "test/mocks/enfermera-repository.mock";
import { IngresoRepositoryMock } from "test/mocks/ingreso-repository.mock";
import { PacienteRepositoryMock } from "test/mocks/paciente-repository.mock";

export class CustomWorld {
  ingresoServicio: IIngresoService;
  pacienteServicio: IPacienteService;
  enfermeraServicio: IEnfermeraService;

  paciente: Paciente | null = null;
  obraSocialMock: ObraSocial = new ObraSocial("1","OSDE");
  afiliadoMock: Afiliado = {
    obraSocial: this.obraSocialMock,
    numeroAfiliado: "1"
  }
  enfermeraMock: Enfermera | null;
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
    const enfermeraRepo = new EnfermeraRepositoryMock();

    this.ingresoServicio = new IngresoService(ingresoRepo);
    this.pacienteServicio = new PacienteService(pacienteRepo);
    this.enfermeraServicio = new EnfermeraService(enfermeraRepo);
  }

  reset(): void {
    this.paciente = null;
    this.ingreso = null;
    this.datosIngreso = null;
  }
}

setWorldConstructor(CustomWorld);