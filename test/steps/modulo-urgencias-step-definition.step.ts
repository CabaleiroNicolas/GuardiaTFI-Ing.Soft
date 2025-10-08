import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { stringify } from 'querystring';

// Variables para simular la base de datos y el sistema
// (En un entorno real, estas serían gestionadas por servicios y repositorios)
let pacientesEnEspera: any[] = [];
let pacientesRegistrados: any[];
let paciente;
let datosIngreso;
let signosVitales;
let ingreso = {
  paciente,
  signosVitales,
  informe: "",
  nivelEmergencia: "",
  estado: "Pendiente",
  horaActual: ""
};

const ordenNiveles = ["Critica", "Emergencia", "Urgencia", "Urgencia Menor", "Sin Urgencia"];

let ingresoServicio = {
    registrar: (ingreso) => {

      try {
        ingresoServicio.comprobarCampos(ingreso);
      }
      catch (error) {
        return error.message;
      }
    
      const infoPaciente = {
        dni: ingreso.paciente.dni,
        nombre: ingreso.paciente.nombre,
        nivelEmergencia: ingreso.nivelEmergencia,
        estado: ingreso.estado,
        horaIngreso: ingreso.horaActual
      }
    
      pacientesEnEspera.push(infoPaciente);
      pacientesEnEspera = ingresoServicio.ordenarLista(pacientesEnEspera);
    
      return "El ingreso se registró con éxito!";
    },
  
    ordenarLista: (colaEspera: any[]) => {
        colaEspera.sort((ingreso1, ingreso2) => {
          const nivel1 = ordenNiveles.indexOf(ingreso1.nivelEmergencia);
          const nivel2 = ordenNiveles.indexOf(ingreso2.nivelEmergencia);

          return nivel1 - nivel2;
        })
      
        return colaEspera;
    },
    
    comprobarCampos: (ingreso) => {
        const signosVitales = ingreso.signosVitales;
        const tensionArterial = signosVitales.tensionArterial;

        if (!signosVitales.temperatura || !signosVitales.frecCardiaca || !signosVitales.frecRespiratoria || !tensionArterial.frecSistolica || !tensionArterial.frecDiastolica || !ingreso.informe || !ingreso.nivelEmergencia)
          throw new Error("ERROR: Hay campos sin completar");

        if (signosVitales.frecCardiaca < 0)
          throw new Error("ERROR: El valor de la frecuencia cardíaca no puede ser negativo");
    
        if (signosVitales.frecRespiratoria < 0)
          throw new Error("ERROR: El valor de la frecuencia respiratoria no puede ser negativo");
    }
}

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
    signosVitales = {
      temperatura: datosIngreso.temperatura,
      frecCardiaca: datosIngreso.frecuenciaCardiaca,
      frecRespiratoria: datosIngreso.frecuenciaRespiratoria,
      tensionArterial: {
        frecSistolica: datosIngreso.tensionArterial.split("/")[0],
        frecDiastolica: datosIngreso.tensionArterial.split("/")[1]
      }
    };

    ingreso.paciente = paciente;
    ingreso.signosVitales = signosVitales;
    ingreso.informe = datosIngreso.informe;
    ingreso.nivelEmergencia = datosIngreso.nivelEmergencia;
    ingreso.horaActual = horaActual;

    ingresoServicio.registrar(ingreso);
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

// Scenario: Ingreso de paciente cargando frecuencia cardíaca con valor negativo

Then('debo ver un mensaje de error {string}', function (mensajeErrorEsperado) {  
    signosVitales = {
      temperatura: datosIngreso.temperatura,
      frecCardiaca: datosIngreso.frecuenciaCardiaca,
      frecRespiratoria: datosIngreso.frecuenciaRespiratoria,
      tensionArterial: {
        frecSistolica: datosIngreso.tensionArterial.split("/")[0],
        frecDiastolica: datosIngreso.tensionArterial.split("/")[1]
      }
    };

    ingreso.paciente = paciente;
    ingreso.signosVitales = signosVitales;

    let mensaje = ingresoServicio.registrar(ingreso);
  
    expect(mensaje).to.be.equal(mensajeErrorEsperado);
});