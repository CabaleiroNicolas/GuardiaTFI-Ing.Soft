import { PacienteService } from "src/modules/pacientes/application/services/paciente.service";
import { PacienteDto } from "src/modules/pacientes/domain/value-objects/paciente.dto";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";

// Helper de test
const crearPacienteDto = (obraSocial?: ObraSocial): PacienteDto => ({
  cuil: "20123456781",
  apellido: "Perez",
  nombre: "Juan",
  calle: "Calle x",
  numero: 13,
  localidad: "Tucumán",
  numeroAfiliado: obraSocial ? "1" : "",
  obraSocial: obraSocial ? obraSocial.getNombre() : ""
});

describe("PacienteService", () => {
  let pacienteRepo: any;
  let obraSocialServ: any;
  let afiliadoServ: any;
  let service: PacienteService;

  beforeEach(() => {
    pacienteRepo = {
      obtener: jest.fn(),
      registrar: jest.fn(),
      obtenerTodos: jest.fn(),
    };

    obraSocialServ = {
      buscar: jest.fn(),
    };

    afiliadoServ = {
      buscar: jest.fn(),
    };

    service = new PacienteService(pacienteRepo, obraSocialServ, afiliadoServ);
  });

  // ==========================
  // 1) Registro con obra social
  // ==========================
  it("registra un paciente válido con obra social existente", async () => {
    // Arrange
    const obra = new ObraSocial("1", "Obra social x");
    const dto = crearPacienteDto(obra);

    
    pacienteRepo.obtener.mockResolvedValue(null);
    obraSocialServ.buscar.mockResolvedValue(obra);
    afiliadoServ.buscar.mockResolvedValue({
      numeroAfiliado: dto.numeroAfiliado,
      cuil: dto.cuil,
      obraSocial: obra
    });

    // Act
    await service.registrar(dto);

    // Assert
    expect(pacienteRepo.registrar).toHaveBeenCalled();
    expect(pacienteRepo.registrar).toHaveBeenCalledWith(expect.any(Object));
  });

  // ==========================
  // 2) Registro sin obra social
  // ==========================
  it("registra un paciente sin obra social", async () => {
    // Arrange
    const dto = crearPacienteDto();

    pacienteRepo.obtener.mockResolvedValue(null);

    // Act
    await service.registrar(dto);

    // Assert
    expect(pacienteRepo.registrar).toHaveBeenCalled();
    expect(pacienteRepo.registrar).toHaveBeenCalledWith(expect.any(Object));
  });

  // ==========================
  // 3) Obra social inexistente
  // ==========================
  it("lanza error si la obra social no existe", async () => {
    // Arrange
    const obra = new ObraSocial("2", "Inexistente");
    const dto = crearPacienteDto(obra);

    pacienteRepo.obtener.mockResolvedValue(null);
    obraSocialServ.buscar.mockResolvedValue(null);

    // Act + Assert
    await expect(service.registrar(dto))
      .rejects.toThrow("Obra social inexistente");
  });

  // ==========================
  // 4) Paciente no afiliado a obra social (verificando cuil)
  // ==========================
  it("lanza error si el número de afiliado le corresponde a otro cuil al ingresado", async () => {
    // Arrange
    const obra = new ObraSocial("1", "Obra social x");
    const dto = crearPacienteDto(obra);

    obraSocialServ.buscar.mockResolvedValue(obra);
    afiliadoServ.buscar.mockResolvedValue({
      numeroAfiliado: dto.numeroAfiliado,
      cuil: "otro-cuil",
      obraSocial: obra
    });

    // Act + Assert
    await expect(service.registrar(dto))
      .rejects.toThrow("El Número de Afiliado no está vinculado al cuil");
  });

  // ==========================
  // 4) Paciente no afiliado a obra social (verificando obra social)
  // ==========================
  it("lanza error si el número de afiliado corresponde a otra obra social a la ingresada", async () => {
    // Arrange
    const obraIngresada = new ObraSocial("1", "Obra social x");
    const obraAfiliada = new ObraSocial("2", "Obra social y");
    const dto = crearPacienteDto(obraIngresada);

    obraSocialServ.buscar.mockResolvedValue(obraIngresada);
    afiliadoServ.buscar.mockResolvedValue({
      numeroAfiliado: dto.numeroAfiliado,
      cuil: dto.cuil,
      obraSocial: obraAfiliada
    });

    // Act + Assert
    await expect(service.registrar(dto))
      .rejects.toThrow("El paciente no está afiliado a la Obra Social");
  });

  // ==========================
  // 5) Validaciones de campos obligatorios
  // ==========================
  it("lanza error si falta algún dato obligatorio", async () => {
    // Arrange
    const dtoSinCuil = { ...crearPacienteDto(), cuil: "" };
    const dtoSinApellido = { ...crearPacienteDto(), apellido: "" };
    const dtoSinNombre = { ...crearPacienteDto(), nombre: "" };
    const dtoSinCalle = { ...crearPacienteDto(), calle: "" };
    const dtoSinNumero = { ...crearPacienteDto(), numero: 0 };
    const dtoSinLocalidad = { ...crearPacienteDto(), localidad: "" };

    // Act + Assert
    await expect(service.registrar(dtoSinCuil))
      .rejects.toThrow("El campo cuil no puede estar vacío");
    await expect(service.registrar(dtoSinApellido))
      .rejects.toThrow("El campo apellido no puede estar vacío");
    await expect(service.registrar(dtoSinNombre))
      .rejects.toThrow("El campo nombre no puede estar vacío");
    await expect(service.registrar(dtoSinCalle))
      .rejects.toThrow("El campo calle no puede estar vacío");
    await expect(service.registrar(dtoSinNumero))
      .rejects.toThrow("El campo numero no puede estar vacío");
    await expect(service.registrar(dtoSinLocalidad))
      .rejects.toThrow("El campo localidad no puede estar vacío");
  });

  // ==========================
  // 6) CUIL inválido
  // ==========================
  it("lanza error si el CUIL no cumple el formato", async () => {
    // Arrange
    const dto = crearPacienteDto();
    dto.cuil = "123";

    // Act + Assert
    await expect(service.registrar(dto))
      .rejects.toThrow("Formato de CUIL incorrecto");
  });
});
