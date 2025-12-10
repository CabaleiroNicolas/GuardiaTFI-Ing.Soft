import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'chai'; 
import { Enfermera } from 'src/modules/urgencias/domain/entities/enfermera.entity';
import { NivelEmergencia, NivelEmergenciaHelper } from 'src/modules/urgencias/domain/value-objects/nivel-emergencia.enum';
import { SignosVitales } from 'src/modules/urgencias/domain/value-objects/signos-vitales.vo';
import { CustomWorld } from 'test/support/world';
import { PacienteDto } from 'src/modules/pacientes/domain/value-objects/paciente.dto';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';
import { RegistrarIngresoDto } from 'src/modules/urgencias/domain/value-objects/registrar-ingreso.dto';

Before((scenario) => {
  console.log(`\n\nSCENARIO: ${scenario.pickle.name}`);
});


// BACKGROUND
Given('los pacientes registrados con los siguientes datos:', function (this: CustomWorld, dataTable) {
  const pacientes = dataTable.hashes();

  for (const p of pacientes) {
    const pacienteDto: PacienteDto = {
      cuil: p.cuil,
      apellido: p.apellido,
      nombre: p.nombre,
      calle: p.calle,
      numero: p.numero,
      localidad: p.localidad,
      obraSocial: "",
      numeroAfiliado: ""
    };

    this.pacienteServicio.registrar(pacienteDto);
  }
});

Given('existe una enfermera registrada con los siguientes datos:', function (this: CustomWorld, dataTable) {
  const enfermeras = dataTable.hashes();

  for (const e of enfermeras) {
    const enfermera = new Enfermera(1, "martina.stoessel@example.com","test", UserRole.ENFERMERA, e.cuil, e.apellido, e.nombre, e.matricula);
    this.enfermeraMock = enfermera;
    this.enfermeraServicio.registrar(enfermera);
  }
});


// SCENARIO: Ingreso de urgencias de paciente existente
// SCENARIO: Ingreso de paciente con mayor nivel de emergencia
// SCENARIO: Ingreso de paciente con menor nivel de emergencia
// SCENARIO: Ingreso de paciente con igual nivel de emergencia

Given('el sistema tiene la siguiente cola de pacientes en espera:', async function (this: CustomWorld, dataTable) {
  const ingresos = dataTable.hashes();

  for (const i of ingresos) {
    const paciente = await this.pacienteServicio.buscar(i.cuil);
    const nivelEmergencia: NivelEmergencia = NivelEmergenciaHelper.nivelEmergenciaFromString(i.nivelEmergencia);

    const tensionArterial = this.signosVitalesMock.tensionArterial.frecSistolica + "/" + this.signosVitalesMock.tensionArterial.frecDiastolica;

    const registrarIngresoDto: RegistrarIngresoDto = {
      cuil: paciente!.getCuil(),
      nivelEmergencia,
      frecCardiaca: this.signosVitalesMock.frecCardiaca,
      frecRespiratoria: this.signosVitalesMock.frecRespiratoria,
      temperatura: this.signosVitalesMock.temperatura,
      tensionArterial,
      informe: this.informeMock
    }

    this.ingresoServicio.registrar(registrarIngresoDto, this.enfermeraMock.userId);
  }
});

When('el paciente ingresa a urgencias con los siguientes datos:', async function (this: CustomWorld, dataTable) {
  this.datosIngreso = dataTable.hashes()[0];
  this.nivelEmergencia = NivelEmergenciaHelper.nivelEmergenciaFromString(this.datosIngreso.nivelEmergencia);
  this.paciente = await this.pacienteServicio.buscar(this.datosIngreso.cuil);
});

Then('se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual {string}', function (this: CustomWorld, horaActual) {
  const signosVitales: SignosVitales = {
    temperatura: this.datosIngreso.temperatura,
    frecCardiaca: this.datosIngreso.frecuenciaCardiaca,
    frecRespiratoria: this.datosIngreso.frecuenciaRespiratoria,
    tensionArterial: {
      frecSistolica: this.datosIngreso.tensionArterial.split("/")[0] as number,
      frecDiastolica: this.datosIngreso.tensionArterial.split("/")[1] as number
    }
  };

  const tensionArterial = this.signosVitalesMock.tensionArterial.frecSistolica + "/" + this.signosVitalesMock.tensionArterial.frecDiastolica;

  const registrarIngresoDto: RegistrarIngresoDto = {
    cuil: this.paciente!.getCuil(),
    nivelEmergencia: this.nivelEmergencia,
    frecCardiaca: signosVitales.frecCardiaca,
    frecRespiratoria: signosVitales.frecRespiratoria,
    temperatura: signosVitales.temperatura,
    tensionArterial,
    informe: this.datosIngreso.informe
  }

  this.ingresoServicio.registrar(registrarIngresoDto, this.enfermeraMock.userId);
});

Then('la cola de espera de pacientes es:', async function (this: CustomWorld, dataTable) {

  const ingresosEsperados = JSON.stringify(dataTable.hashes());

  const ingresosActuales = JSON.stringify((await this.ingresoServicio.obtenerIngresosEnEspera()).map(i => {
    const paciente = i.getPaciente();
    return { nombre: `${paciente.getNombre()} ${paciente.getApellido()}` };
  }));

  expect(ingresosActuales).to.deep.equal(ingresosEsperados);
});



// SCENARIO: Ingreso de urgencias de paciente no existente

When('un paciente ingresa a urgencias con los siguientes datos:', async function (this: CustomWorld, dataTable) {
  this.datosIngreso = dataTable.hashes()[0];
  this.paciente = await this.pacienteServicio.buscar(this.datosIngreso.cuil);
  expect(this.paciente).to.be.null;
});

Then('se registra el nuevo paciente', async function (this: CustomWorld) {
  const nombre = this.datosIngreso.nombre;
  const apellido = this.datosIngreso.apellido;
  const cuil = this.datosIngreso.cuil;

  const pacienteDto: PacienteDto = {
    cuil,
    apellido,
    nombre,
    calle: this.domicilioMock.calle,
    numero: this.domicilioMock.numero,
    localidad: this.domicilioMock.localidad,
    obraSocial: "",
    numeroAfiliado: ""
  };

  this.pacienteServicio.registrar(pacienteDto);

  // this.paciente = new Paciente(cuil, apellido, nombre, this.domicilioMock, null);
  // await this.pacienteServicio.registrar(this.paciente);

  this.paciente = await this.pacienteServicio.buscar(cuil);
  expect(this.paciente).to.not.be.null;
});



// SCENARIO: Ingreso de paciente cargando frecuencia cardíaca con valor negativo
// SCENARIO: Ingreso de paciente cargando frecuencia respiratoria con valor negativo
// SCENARIO: Ingreso a urgencias de paciente existente con datos incompletos

Then('debo ver un mensaje de error {string}', async function (this: CustomWorld, mensajeErrorEsperado) {
  const signosVitales: SignosVitales = {
    temperatura: this.datosIngreso.temperatura,
    frecCardiaca: this.datosIngreso.frecuenciaCardiaca,
    frecRespiratoria: this.datosIngreso.frecuenciaRespiratoria,
    tensionArterial: {
      frecSistolica: this.datosIngreso.tensionArterial.split("/")[0] as number,
      frecDiastolica: this.datosIngreso.tensionArterial.split("/")[1] as number
    }
  };

  this.nivelEmergencia = NivelEmergenciaHelper.nivelEmergenciaFromString(this.datosIngreso.nivelEmergencia);

  const tensionArterial = signosVitales.tensionArterial.frecSistolica + "/" + signosVitales.tensionArterial.frecDiastolica;

  const registrarIngresoDto: RegistrarIngresoDto = {
    cuil: this.paciente!.getCuil(),
    nivelEmergencia: this.nivelEmergencia,
    frecCardiaca: signosVitales.frecCardiaca,
    frecRespiratoria: signosVitales.frecRespiratoria,
    temperatura: signosVitales.temperatura,
    tensionArterial,
    informe: this.datosIngreso.informe
  }

  console.log("temperatura " + registrarIngresoDto.temperatura);
  console.log("frecCardiaca " + registrarIngresoDto.frecCardiaca);
  console.log("frecRespiratoria " + registrarIngresoDto.frecRespiratoria);
  console.log("frecSistolica " + signosVitales.tensionArterial.frecSistolica);
  console.log("frecDiastolica " + signosVitales.tensionArterial.frecDiastolica);

  try {
    await this.ingresoServicio.registrar(registrarIngresoDto, this.enfermeraMock.userId);
    expect.fail("La función no lanzó ningún error");
  } catch (error: any) {
    expect(error.message).to.equal(mensajeErrorEsperado);
  }
});