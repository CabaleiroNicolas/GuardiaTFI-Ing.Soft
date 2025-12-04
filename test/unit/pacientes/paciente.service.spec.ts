import { IAfiliadoRepository } from "src/modules/pacientes/application/ports/afiliado-repository.interface";
import { IAfiliadoService } from "src/modules/pacientes/application/ports/afiliado-service.interface";
import { IObraSocialRepository } from "src/modules/pacientes/application/ports/obra-social-repository.interface";
import { IObraSocialService } from "src/modules/pacientes/application/ports/obra-social-service.interface";
import { IPacienteRepository } from "src/modules/pacientes/application/ports/paciente-repository.interface";
import { AfiliadoService } from "src/modules/pacientes/application/services/afiliado.service";
import { ObraSocialService } from "src/modules/pacientes/application/services/obra-social.service";
import { PacienteService } from "src/modules/pacientes/application/services/paciente.service";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";
import { Domicilio } from "src/modules/pacientes/domain/value-objects/domicilio.vo";
import { PacienteDto } from "src/modules/pacientes/domain/value-objects/paciente.dto";
import { AfiliadoRepositoryMock } from "test/mocks/afiliado-repository.mock";
import { ObraSocialRepositoryMock } from "test/mocks/obra-social-repository.mock";
import { PacienteRepositoryMock } from "test/mocks/paciente-repository.mock";

// Esto indica que se prueba el servicio de pacientes
describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepo: IPacienteRepository;
  let obraSocialRepo: IObraSocialRepository;
  let afiliadoRepo: IAfiliadoRepository;
  let obraSocialServ: IObraSocialService;
  let afiliadoServ: IAfiliadoService;

  // Esto se ejecuta antes de cada método de test
  beforeEach(() => {
    pacienteRepo = new PacienteRepositoryMock();
    obraSocialRepo = new ObraSocialRepositoryMock();
    afiliadoRepo = new AfiliadoRepositoryMock();
    obraSocialServ = new ObraSocialService(obraSocialRepo);
    afiliadoServ = new AfiliadoService(afiliadoRepo);
    service = new PacienteService(pacienteRepo, obraSocialServ, afiliadoServ);
  });

  // Criterio de aceptación 1
  describe('PacienteService.registrar', () => {
    it('si el paciente tiene todos los datos mandatorios provistos y una obra social existente, debería registrarse exitosamente', async () => {
      // Arrange
      const obraSocial: ObraSocial = new ObraSocial('1', 'Obra social x');
      const paciente = crearPacienteDto(obraSocial);
      const afiliado: Afiliado = { numeroAfiliado: paciente.numeroAfiliado, cuil: paciente.cuil, obraSocial };
      await obraSocialRepo.registrar(obraSocial);
      await afiliadoRepo.registrar(afiliado);

      // Act + Assert
      await service.registrar(paciente);
      const pacienteRegistrado = await pacienteRepo.obtener(paciente.cuil);
      expect(pacienteRegistrado).not.toBeNull();
    });

    // Criterio de aceptación 2
    it('si el paciente tiene todos los datos mandatorios provistos y no tiene obra social, debería registrarse exitosamente', async () => {
      // Arrange
      const paciente = crearPacienteDto();

      // Act + Assert
      await service.registrar(paciente);
      const pacienteRegistrado = await pacienteRepo.obtener(paciente.cuil);
      expect(pacienteRegistrado).not.toBeNull();
    });

    // Criterio de aceptación 3
    it('si el paciente tiene todos los datos mandatorios provistos y una obra social inexistente, debería notificarse un mensaje de error', async () => {
      // Arrange
      const obraSocialExistente = new ObraSocial('1', 'Obra social x');
      const obraSocialInexistente = new ObraSocial('2', 'Obra social y');
      const paciente = crearPacienteDto(obraSocialInexistente);
      await obraSocialRepo.registrar(obraSocialExistente);

      // Act + Assert
      await expect(service.registrar(paciente)).rejects.toThrow("Obra social inexistente");
    });

    // Criterio de aceptación 4
    it('si el paciente tiene todos los datos mandatorios y una obra social existente a la cual no esta afiliado, debería notificarse un mensaje de error indicando que el paciente no esta afiliado a la obra social', async () => {
      // Arrange
      const obraSocialAfiliada = new ObraSocial('1', 'Obra social x');
      const obraSocialNoAfiliada = new ObraSocial('2', 'Obra social y');
      const paciente = crearPacienteDto(obraSocialNoAfiliada);
      const afiliadoExistente: Afiliado = {
        numeroAfiliado: "1",
        cuil: paciente.cuil,
        obraSocial: obraSocialAfiliada,
      }
      await afiliadoRepo.registrar(afiliadoExistente);
      await obraSocialRepo.registrar(obraSocialAfiliada);
      await obraSocialRepo.registrar(obraSocialNoAfiliada);

      // Act + Assert
      await expect(service.registrar(paciente)).rejects.toThrow("El paciente no está afiliado a la obra social");
    });

    // Criterio de aceptación 4*
    it('si el paciente tiene todos los datos mandatorios y un numero de afiliado existente al cual no está vinculado, debería notificarse un mensaje de error indicando que el paciente no esta afiliado a la obra social', async () => {
      // Arrange
      const obraSocialAfiliada = new ObraSocial('1', 'Obra social x');
      const paciente = crearPacienteDto(obraSocialAfiliada);
      const afiliadoExistente: Afiliado = {
        numeroAfiliado: "1",
        cuil: "20123456782",
        obraSocial: obraSocialAfiliada,
      }
      await afiliadoRepo.registrar(afiliadoExistente);
      await obraSocialRepo.registrar(obraSocialAfiliada);

      // Act + Assert
      await expect(service.registrar(paciente)).rejects.toThrow("El número de afiliado no está vinculado al cuil");
    });

    // Criterio de aceptación 5
    it('si el paciente tiene algun dato mandatorio omitido, debería notificarse un mensaje de error indicando el campo que se omitió durante el registro del paciente.', async () => {
      // Arrange
      const domicilioCompleto: Domicilio = { calle: 'Calle x', numero: 13, localidad: 'Tucumán' };
      const domicilioSinCalle: Domicilio = { calle: '', numero: 13, localidad: 'Tucumán' };
      const domicilioSinNumero: Domicilio = { calle: 'Calle x', numero: 0, localidad: 'Tucumán' };
      const domicilioSinLocalidad : Domicilio = { calle: 'Calle x', numero: 13, localidad: '' };
      const pacienteSinCuil = new Paciente('', 'Perez', 'Juan', domicilioCompleto, null);
      const pacienteSinApellido = new Paciente('20123456781', '', 'Juan', domicilioCompleto, null);
      const pacienteSinNombre = new Paciente('20123456781', 'Perez', '', domicilioCompleto, null);
      const pacienteSinCalle = new Paciente('20123456781', 'Perez', 'Juan', domicilioSinCalle, null);
      const pacienteSinNumero = new Paciente('20123456781', 'Perez', 'Juan', domicilioSinNumero, null);
      const pacienteSinLocalidad = new Paciente('20123456781', 'Perez', 'Juan', domicilioSinLocalidad, null);

      // Act + Assert
      await expect(service.registrar(convertirAPacienteDto(pacienteSinCuil))).rejects.toThrow("El campo cuil no puede estar vacío");
      await expect(service.registrar(convertirAPacienteDto(pacienteSinApellido))).rejects.toThrow("El campo apellido no puede estar vacío");
      await expect(service.registrar(convertirAPacienteDto(pacienteSinNombre))).rejects.toThrow("El campo nombre no puede estar vacío");
      await expect(service.registrar(convertirAPacienteDto(pacienteSinCalle))).rejects.toThrow("El campo calle no puede estar vacío");
      await expect(service.registrar(convertirAPacienteDto(pacienteSinNumero))).rejects.toThrow("El campo numero no puede estar vacío");
      await expect(service.registrar(convertirAPacienteDto(pacienteSinLocalidad))).rejects.toThrow("El campo localidad no puede estar vacío");
    })

    // Criterio de aceptación: validación de formato de cuil del paciente
    it('si el paciente tiene un formato de cuil inválido, debería notificarse un mensaje de error', async () => {
      // Arrange
      const cuilMalFormateado = '29123456781';
      const domicilio = { calle: 'Calle x', numero: 13, localidad: 'Tucumán' };
      const paciente = new Paciente(cuilMalFormateado, 'Perez', 'Juan', domicilio, null);

      // Act + Assert
      await expect(service.registrar(convertirAPacienteDto(paciente))).rejects.toThrow("Formato de CUIL incorrecto");
    })

    function crearPacienteDto(obraSocial?: ObraSocial): PacienteDto {
      const calle = "Calle x";
      const numero = 13;
      const localidad = "Tucumán";
      const numeroAfiliado = obraSocial ? "1" : "";
      const nombreObraSocial = obraSocial ? obraSocial.getNombre() : "";

      return {
        cuil: "20123456781",
        apellido: "Perez",
        nombre: "Juan",
        calle,
        numero,
        localidad,
        numeroAfiliado,
        obraSocial: nombreObraSocial
      };
    }

    function convertirAPacienteDto(paciente: Paciente): PacienteDto {
      return {
        cuil: paciente.getCuil(),
        apellido: paciente.getApellido(),
        nombre: paciente.getNombre(),
        calle: paciente.getDomicilio().calle,
        numero: paciente.getDomicilio().numero,
        localidad: paciente.getDomicilio().localidad,
        numeroAfiliado: paciente.getObraSocial()?.numeroAfiliado || "",
        obraSocial: paciente.getObraSocial()?.obraSocial.getNombre() || ""
      }
    }
  })
});