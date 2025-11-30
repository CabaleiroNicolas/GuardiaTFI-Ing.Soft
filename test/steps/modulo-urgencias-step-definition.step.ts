import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Enfermera } from 'src/modules/urgencias/domain/entities/enfermera.entity';
import { Ingreso } from 'src/modules/urgencias/domain/entities/ingreso.entity';
import { Domicilio } from 'src/modules/pacientes/domain/value-objects/domicilio.vo';
import { NivelEmergencia, NivelEmergenciaHelper } from 'src/modules/urgencias/domain/value-objects/nivel-emergencia.enum';
import { SignosVitales } from 'src/modules/urgencias/domain/value-objects/signos-vitales.vo';
import { CustomWorld } from 'test/support/world';
import { Paciente } from 'src/modules/pacientes/domain/entities/paciente.entity';

Before((scenario) => {
  console.log(`\n\nSCENARIO: ${scenario.pickle.name}`);
});


// BACKGROUND
Given('los pacientes registrados con los siguientes datos:', function (this: CustomWorld, dataTable) {
  const pacientes = dataTable.hashes();

  for (const p of pacientes) {
    const domicilio: Domicilio = {
      calle: p.calle,
      numero: p.numero,
      localidad: p.localidad
    };
    const paciente = new Paciente(p.cuil, p.apellido, p.nombre, domicilio, null);
    this.pacienteServicio.registrar(paciente);
  }
});

Given('existe una enfermera registrada con los siguientes datos:', function (this: CustomWorld, dataTable) {
  const enfermeras = dataTable.hashes();

  for (const e of enfermeras) {
    const enfermera = new Enfermera(e.cuil, e.apellido, e.nombre, e.matricula);
    this.enfermeraMock = enfermera;
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
    const hora = i.horaIngreso.split(":")[0] as number;
    const minutos = i.horaIngreso.split(":")[1] as number;
    const fecha = new Date(2025, 10, 13, hora, minutos);
    const ingreso = new Ingreso(paciente!, this.enfermeraMock!, fecha, this.informeMock, nivelEmergencia, this.signosVitalesMock);

    this.ingresoServicio.registrar(ingreso);
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

  const hora = horaActual.split(":")[0] as number;
  const minutos = horaActual.split(":")[1] as number;
  const fecha = new Date(2025, 10, 13, hora, minutos);
  const ingreso = new Ingreso(this.paciente!, this.enfermeraMock!, fecha, this.datosIngreso.informe, this.nivelEmergencia, signosVitales);

  this.ingresoServicio.registrar(ingreso);
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

  this.paciente = new Paciente(cuil, apellido, nombre, this.domicilioMock, null);
  await this.pacienteServicio.registrar(this.paciente);

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
  const fecha = new Date(2025, 10, 13, 8, 20);
  this.nivelEmergencia = NivelEmergenciaHelper.nivelEmergenciaFromString(this.datosIngreso.nivelEmergencia);

  const ingreso = new Ingreso(this.paciente!, this.enfermeraMock!, fecha, this.informeMock, this.nivelEmergencia, signosVitales);

  const mensaje = await this.ingresoServicio.registrar(ingreso);

  expect(mensaje).to.be.equal(mensajeErrorEsperado);
});