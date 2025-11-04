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

  describe('registrar()', () => {
    it('si el paciente tiene todos los datos mandatorios provistos y una obra social existente, debería registrarse exitosamente', () => {
      // Arrange
      const domicilio: Domicilio = {
        calle: 'Calle x',
        numero: 13,
        localidad: 'Tucumán'
      };
      const obraSocial: ObraSocial = new ObraSocial('1', 'Obra social x');
      const afiliado: Afiliado = {
        numeroAfiliado: '123',
        obraSocial,
      }
      const paciente = new Paciente('20-12345678-1', 'Perez', 'Juan', domicilio, afiliado);
      obraSocialRepo.registrar(obraSocial);

      // Act
      const resultado = pacienteRepo.registrar(paciente);

      // Assert
      expect(resultado).toBe(true);
    });

    it('si el paciente tiene todos los datos mandatorios provistos y no tiene obra social, debería registrarse exitosamente', () => {
      // Arrange
      const domicilio: Domicilio = {
        calle: 'Calle x',
        numero: 13,
        localidad: 'Tucumán'
      };
      const paciente = new Paciente('20-12345678-1', 'Perez', 'Juan', domicilio, null);

      // Act
      const resultado = pacienteRepo.registrar(paciente);

      // Assert
      expect(resultado).toBe(true);
    });

    it('si el paciente tiene todos los datos mandatorios provistos y una obra social inexistente, debería notificarse un mensaje de error', () => {
      // Arrange
      const domicilio: Domicilio = {
        calle: 'Calle x',
        numero: 13,
        localidad: 'Tucumán'
      };
      const obraSocial: ObraSocial = new ObraSocial('2', 'Obra social y');
      const afiliado: Afiliado = {
        numeroAfiliado: '456',
        obraSocial,
      }
      const paciente = new Paciente('20-12345678-1', 'Perez', 'Juan', domicilio, afiliado);

      // Act
      const resultado = pacienteRepo.registrar(paciente);

      // Assert
      expect(resultado).toThrow(new Error("Obra social inexistente"));
    });
  })
});