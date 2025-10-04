import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

// Variables para simular la base de datos y el sistema
// (En un entorno real, estas serían gestionadas por servicios y repositorios)
let pacientesEnEspera: any[] = [];
let pacientesRegistrados: any[];
let paciente;
let datosIngreso;

Given('los pacientes registrados con los siguientes datos:', (dataTable) => {
    pacientesRegistrados = dataTable.hashes();
});

Given('el sistema tiene la siguiente cola de pacientes en espera:', (dataTable) => {
    pacientesEnEspera = dataTable.hashes();
});

When('el paciente ingresa a urgencias con los siguientes datos:', (dataTable) => {
    datosIngreso = dataTable.hashes()[0];
    paciente = pacientesRegistrados.find(p => p.dni === datosIngreso.dni);
});

Then('se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual {string}', (horaActual) => {
    const estado = 'Pendiente';
    pacientesEnEspera.push(
        {
            dni: paciente.dni,
            nombre: paciente.nombre,
            nivelEmergencia: datosIngreso.nivelEmergencia,
            estado,
            horaIngreso: horaActual
        });
});

Then('la cola de espera de pacientes es:', (dataTable) => {
    const colaEspera = dataTable.hashes();
    expect(pacientesEnEspera).to.deep.equal(colaEspera);
});


// Scenario: Ingreso de urgencias de paciente no existente

When('un paciente ingresa a urgencias con los siguientes datos:', (dataTable) => {
    datosIngreso = dataTable.hashes()[0];
    paciente = pacientesRegistrados.find(p => p.dni === datosIngreso.dni);
    expect(paciente).to.be.undefined;
});

Then('se registra el nuevo paciente', () => {
    pacientesRegistrados.push(
        { dni: datosIngreso.dni, nombre: datosIngreso.nombre }
    );
    paciente = pacientesRegistrados.find(p => p.dni === datosIngreso.dni);
    expect(paciente).to.not.be.undefined;
});

