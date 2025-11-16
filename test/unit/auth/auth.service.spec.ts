import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/application/services/auth.service';
import { USER_SERVICIO } from 'src/modules/user/application/ports/user-service.interface';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';

const TOKEN_USER_SERVICIO = USER_SERVICIO;

// Se prueba el servicio de autenticación
describe('AuthService', () => {
  let service: AuthService;
  let userService: any;
  let jwtService: any;

  const testEmail: string = 'test@test.com';

  // Creamos los Mocks de las dependencias
  const mockUserService = {
    findWithPasswordByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  // Mockeamos bcrypt para controlar el resultado de la comparación de la constraseña
  jest.mock('bcrypt');

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TOKEN_USER_SERVICIO,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(TOKEN_USER_SERVICIO);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('debería retornar null si el usuario no se encuentra', async () => {
      // Arrange
      mockUserService.findWithPasswordByEmail.mockResolvedValue(null);

      // Act
      const result = await service.validateUser(testEmail, '123456');

      // Assert
      expect(userService.findWithPasswordByEmail).toHaveBeenCalledWith(testEmail);
      expect(result).toBeNull();
    });

    it('debería retornar null si la contraseña no coincide', async () => {
      // Arrange
      const mockUser = { email: testEmail, password: 'hashedPassword' };
      mockUserService.findWithPasswordByEmail.mockResolvedValue(mockUser);
      
      // Mockeamos bcrypt para que diga que NO coinciden
      const bcryptCompare = jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      // Act
      const result = await service.validateUser(testEmail, 'wrongPassword');

      // Assert
      expect(bcryptCompare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
      expect(result).toBeNull();
    });

    it('debería retornar el usuario sin password si las credenciales son válidas', async () => {
      // Arrange
      const mockUser = { 
        userId: 1, 
        email: testEmail, 
        password: 'hashedPassword', 
        role: 'admin' 
      };
      mockUserService.findWithPasswordByEmail.mockResolvedValue(mockUser);
      
      // Mockeamos bcrypt para que diga que SI coinciden
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      // Act
      const result: any = await service.validateUser(testEmail, 'correctPassword');

      // Assert
      expect(result).toEqual({ userId: 1, email: testEmail, role: 'admin' });
      expect(result.password).toBeUndefined(); // Verificamos que se eliminó el password
    });
  });

  describe('login', () => {
    it('debería retornar un objeto con el access_token', async () => {
      // Arrange
      const user = { userId: 1, email: 'nico@test.com', role: UserRole.MEDICO } as any;
      const expectedToken = 'jwt_token_falso';
      
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.login(user);

      // Assert
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: 1,
        email: 'nico@test.com',
        role: UserRole.MEDICO
      });
      expect(result).toEqual({ access_token: expectedToken });
    });
  });
});