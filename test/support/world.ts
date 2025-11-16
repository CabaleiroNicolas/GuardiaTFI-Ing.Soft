import { setWorldConstructor } from "@cucumber/cucumber";
import { IEnfermeraService } from "src/modules/urgencias/application/ports/enfermera-service.interface";
import { IIngresoService } from "src/modules/urgencias/application/ports/ingreso-service.interface";
import { IPacienteService } from "src/modules/pacientes/application/ports/paciente-service.interface";
import { EnfermeraService } from "src/modules/urgencias/application/services/enfermera.service";
import { IngresoService } from "src/modules/urgencias/application/services/ingreso.service";
import { PacienteService } from "src/modules/pacientes/application/services/paciente.service";
import { Enfermera } from "src/modules/urgencias/domain/entities/enfermera.entity";
import { Ingreso } from "src/modules/urgencias/domain/entities/ingreso.entity";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";
import { Domicilio } from "src/modules/pacientes/domain/value-objects/domicilio.vo";
import { NivelEmergencia } from "src/modules/urgencias/domain/value-objects/nivel-emergencia.enum";
import { SignosVitales } from "src/modules/urgencias/domain/value-objects/signos-vitales.vo";
import { EnfermeraRepositoryMock } from "test/mocks/enfermera-repository.mock";
import { IngresoRepositoryMock } from "test/mocks/ingreso-repository.mock";
import { PacienteRepositoryMock } from "test/mocks/paciente-repository.mock";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";
import { ObraSocialRepositoryMock } from "test/mocks/obra-social-repository.mock";
import { AfiliadoRepositoryMock } from "test/mocks/afiliado-repository.mock";

export class CustomWorld {
  ingresoServicio: IIngresoService;
  pacienteServicio: IPacienteService;
  enfermeraServicio: IEnfermeraService;

  paciente: Paciente | null = null;
  // Los comento porque no definimos en la feature que algun paciente está afiliado a alguna obra social
  // Además, el paciente puede no estar afiliado a alguna obra social
  // Si lo incluyo, creo que deberíamos considerarlo en el background de la feature, pero no creo que
  // sea correcto porque no es el enfoque del módulo de urgencias
  // obraSocialMock: ObraSocial = new ObraSocial("1","OSDE");
  // afiliadoMock: Afiliado = {
  //   obraSocial: this.obraSocialMock,
  //   numeroAfiliado: "1"
  // }
  enfermeraMock: Enfermera;
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
    const obraSocialRepo = new ObraSocialRepositoryMock();
    const afiliadoRepo = new AfiliadoRepositoryMock();
    const enfermeraRepo = new EnfermeraRepositoryMock();

    this.pacienteServicio = new PacienteService(pacienteRepo, obraSocialRepo, afiliadoRepo);
    this.ingresoServicio = new IngresoService(ingresoRepo);
    this.enfermeraServicio = new EnfermeraService(enfermeraRepo);
  }

  reset(): void {
    this.paciente = null;
    this.ingreso = null;
    this.datosIngreso = null;
  }
}

setWorldConstructor(CustomWorld);