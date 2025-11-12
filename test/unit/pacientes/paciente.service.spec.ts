import { IObraSocialRepository } from "src/modules/pacientes/application/ports/obra-social-repository.interface";
import { IPacienteRepository } from "src/modules/pacientes/application/ports/paciente-repository.interface";
import { PacienteService } from "src/modules/pacientes/application/services/paciente.service";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";
import { Domicilio } from "src/modules/pacientes/domain/value-objects/domicilio.vo";
import { ObraSocialRepositoryMock } from "test/mocks/obra-social-repository.mock";
import { PacienteRepositoryMock } from "test/mocks/paciente-repository.mock";

// Esto indica que se prueba el servicio de pacientes
describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepo: IPacienteRepository;
  let obraSocialRepo: IObraSocialRepository;

  // Esto se ejecuta antes de cada método de test
  beforeEach(() => {
    pacienteRepo = new PacienteRepositoryMock();
    obraSocialRepo = new ObraSocialRepositoryMock();
    service = new PacienteService(pacienteRepo, obraSocialRepo);
  });

  describe('PacienteService.registrar', () => {
    it('si el paciente tiene todos los datos mandatorios provistos y una obra social existente, debería registrarse exitosamente', () => {
      // Arrange
      const obraSocial: ObraSocial = new ObraSocial('1', 'Obra social x');
      const paciente = crearPaciente(obraSocial);
      obraSocialRepo.registrar(obraSocial);

      // Act + Assert
      expect(() => service.registrar(paciente)).not.toThrow();
      const pacienteRegistrado = pacienteRepo.obtener(paciente.getCuil());
      expect(pacienteRegistrado).not.toBeNull();
    });

    it('si el paciente tiene todos los datos mandatorios provistos y no tiene obra social, debería registrarse exitosamente', () => {
      // Arrange
      const paciente = crearPaciente();

      // Act + Assert
      expect(() => service.registrar(paciente)).not.toThrow();
      const pacienteRegistrado = pacienteRepo.obtener(paciente.getCuil());
      expect(pacienteRegistrado).not.toBeNull();
    });

    it('si el paciente tiene todos los datos mandatorios provistos y una obra social inexistente, debería notificarse un mensaje de error', () => {
      // Arrange
      const obraSocialExistente = new ObraSocial('1', 'Obra social x');
      const obraSocialInexistente = new ObraSocial('2', 'Obra social y');
      const paciente = crearPaciente(obraSocialInexistente);
      obraSocialRepo.registrar(obraSocialExistente);

      // Act + Assert
      expect(() => service.registrar(paciente)).toThrow("Obra social inexistente");
    });

    function crearPaciente(obraSocial?: ObraSocial): Paciente {
      const domicilio = { calle: 'Calle x', numero: 13, localidad: 'Tucumán' };
      const afiliado = obraSocial ? { numeroAfiliado: '123', obraSocial } : null;
      return new Paciente('20-12345678-1', 'Perez', 'Juan', domicilio, afiliado);
    }
  })
});