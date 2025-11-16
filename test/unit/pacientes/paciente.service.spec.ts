import { IAfiliadoRepository } from "src/modules/pacientes/application/ports/afiliado-repository.interface";
import { IObraSocialRepository } from "src/modules/pacientes/application/ports/obra-social-repository.interface";
import { IPacienteRepository } from "src/modules/pacientes/application/ports/paciente-repository.interface";
import { PacienteService } from "src/modules/pacientes/application/services/paciente.service";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";
import { Domicilio } from "src/modules/pacientes/domain/value-objects/domicilio.vo";
import { AfiliadoRepositoryMock } from "test/mocks/afiliado-repository.mock";
import { ObraSocialRepositoryMock } from "test/mocks/obra-social-repository.mock";
import { PacienteRepositoryMock } from "test/mocks/paciente-repository.mock";

// Esto indica que se prueba el servicio de pacientes
describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepo: IPacienteRepository;
  let obraSocialRepo: IObraSocialRepository;
  let afiliadoRepo: IAfiliadoRepository;

  // Esto se ejecuta antes de cada método de test
  beforeEach(() => {
    pacienteRepo = new PacienteRepositoryMock();
    obraSocialRepo = new ObraSocialRepositoryMock();
    afiliadoRepo = new AfiliadoRepositoryMock();
    service = new PacienteService(pacienteRepo, obraSocialRepo, afiliadoRepo);
  });

  // Criterio de aceptación 1
  describe('PacienteService.registrar', () => {
    it('si el paciente tiene todos los datos mandatorios provistos y una obra social existente, debería registrarse exitosamente', () => {
      // Arrange
      const obraSocial: ObraSocial = new ObraSocial('1', 'Obra social x');
      const paciente = crearPaciente(obraSocial);
      obraSocialRepo.registrar(obraSocial);
      afiliadoRepo.registrar(paciente.getObraSocial()!);

      // Act + Assert
      expect(() => service.registrar(paciente)).not.toThrow();
      const pacienteRegistrado = pacienteRepo.obtener(paciente.getCuil());
      expect(pacienteRegistrado).not.toBeNull();
    });

    // Criterio de aceptación 2
    it('si el paciente tiene todos los datos mandatorios provistos y no tiene obra social, debería registrarse exitosamente', () => {
      // Arrange
      const paciente = crearPaciente();

      // Act + Assert
      expect(() => service.registrar(paciente)).not.toThrow();
      const pacienteRegistrado = pacienteRepo.obtener(paciente.getCuil());
      expect(pacienteRegistrado).not.toBeNull();
    });

    // Criterio de aceptación 3
    it('si el paciente tiene todos los datos mandatorios provistos y una obra social inexistente, debería notificarse un mensaje de error', () => {
      // Arrange
      const obraSocialExistente = new ObraSocial('1', 'Obra social x');
      const obraSocialInexistente = new ObraSocial('2', 'Obra social y');
      const paciente = crearPaciente(obraSocialInexistente);
      obraSocialRepo.registrar(obraSocialExistente);

      // Act + Assert
      expect(() => service.registrar(paciente)).toThrow("Obra social inexistente");
    });

    // Criterio de aceptación 4
    it('si el paciente tiene todos los datos mandatorios y una obra social existente a la cual no esta afiliado, debería notificarse un mensaje de error indicando que el paciente no esta afiliado a la obra social', () => {
      // Arrange
      const obraSocialAfiliada = new ObraSocial('1', 'Obra social x');
      const obraSocialNoAfiliada = new ObraSocial('2', 'Obra social y');
      const afiliadoExistente: Afiliado = {
        numeroAfiliado: "1",
        obraSocial: obraSocialAfiliada,
      }
      const afiliadoInexistente: Afiliado = {
        numeroAfiliado: "1",
        obraSocial: obraSocialNoAfiliada,
      }
      const paciente = crearPaciente(obraSocialNoAfiliada);
      afiliadoRepo.registrar(afiliadoExistente);
      obraSocialRepo.registrar(obraSocialAfiliada);
      obraSocialRepo.registrar(obraSocialNoAfiliada);

      // Act + Assert
      expect(() => service.registrar(paciente)).toThrow("El paciente no está afiliado a la obra social");
    });

    // Criterio de aceptación 5
    it('si el paciente tiene algun dato mandatorio omitido, debería notificarse un mensaje de error indicando el campo que se omitió durante el registro del paciente.', () => {
      // Arrange
      const domicilioCompleto: Domicilio = { calle: 'Calle x', numero: 13, localidad: 'Tucumán' };
      const domicilioSinCalle: Domicilio = { calle: '', numero: 13, localidad: 'Tucumán' };
      const domicilioSinNumero: Domicilio = { calle: 'Calle x', numero: 0, localidad: 'Tucumán' };
      const domicilioSinLocalidad : Domicilio = { calle: 'Calle x', numero: 13, localidad: '' };
      const pacienteSinCuil = new Paciente('', 'Perez', 'Juan', domicilioCompleto, null);
      const pacienteSinApellido = new Paciente('20-12345678-1', '', 'Juan', domicilioCompleto, null);
      const pacienteSinNombre = new Paciente('20-12345678-1', 'Perez', '', domicilioCompleto, null);
      const pacienteSinCalle = new Paciente('20-12345678-1', 'Perez', 'Juan', domicilioSinCalle, null);
      const pacienteSinNumero = new Paciente('20-12345678-1', 'Perez', 'Juan', domicilioSinNumero, null);
      const pacienteSinLocalidad = new Paciente('20-12345678-1', 'Perez', 'Juan', domicilioSinLocalidad, null);

      // Act + Assert
      expect(() => service.registrar(pacienteSinCuil)).toThrow("El campo cuit no puede estar vacío");
      expect(() => service.registrar(pacienteSinApellido)).toThrow("El campo apellido no puede estar vacío");
      expect(() => service.registrar(pacienteSinNombre)).toThrow("El campo nombre no puede estar vacío");
      expect(() => service.registrar(pacienteSinCalle)).toThrow("El campo calle no puede estar vacío");
      expect(() => service.registrar(pacienteSinNumero)).toThrow("El campo numero no puede estar vacío");
      expect(() => service.registrar(pacienteSinLocalidad)).toThrow("El campo localidad no puede estar vacío");
    })

    // Criterio de aceptación: validación de formato de cuil del paciente
    it('si el paciente tiene un formato de cuil inválido, debería notificarse un mensaje de error', () => {
      // Arrange
      const cuilMalFormateado = '20123456781';
      const domicilio = { calle: 'Calle x', numero: 13, localidad: 'Tucumán' };
      const paciente = new Paciente(cuilMalFormateado, 'Perez', 'Juan', domicilio, null);

      // Act + Assert
      expect(() => service.registrar(paciente)).toThrow("Formato de CUIL incorrecto");
    })

    function crearPaciente(obraSocial?: ObraSocial): Paciente {
      const domicilio = { calle: 'Calle x', numero: 13, localidad: 'Tucumán' };
      const afiliado = obraSocial ? { numeroAfiliado: '1', obraSocial } : null;
      return new Paciente('20-12345678-1', 'Perez', 'Juan', domicilio, afiliado);
    }
  })
});