import { BadRequestException, GoneException, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserService } from '../ports/user-service.interface';
import { User } from '../../domain/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../ports/user-repository.interface';

@Injectable()
export class UserService implements IUserService {

    constructor(
    private userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}
    
  async createUser(email: string, password: string) {
    let newUser: User;

    const userAlreadyExists: boolean = !!(await this.findByEmail(email));

    if (userAlreadyExists) throw new BadRequestException('User already exists');

    if (password) {
      const hashedPassword: string = await bcrypt.hash(password, 12);
      newUser = new User({ email, password: hashedPassword });
    } else {
      newUser = new User({ email });
    }

    await this.userRepo.save(newUser);
    
   /*  await this.emailSender.sendConfirmationEmail(
      email,
      this.jwtService.sign({ email: email }),
    ); */
  }

  async confirmUser(token: string) {
    let payload: { email: string };

    try {
      payload = this.jwtService.verify(token);
    } catch (e: any) {
      if (e.name === 'TokenExpiredError')
        throw new GoneException('Token expired');
      if (e.name === 'JsonWebTokenError')
        throw new UnauthorizedException('Token invalid');
      if (e.name === 'NotBeforeError')
        throw new UnauthorizedException('Token not valid yet');
      throw e;
    }

    if (!payload.email) throw new UnauthorizedException('Token invalid');

    //await this.userRepo.update({ email: payload.email });
  }

  // Búsqueda “pública” (no devuelve password)
  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user: User | null = await this.userRepo.findByEmail(email);
    if(!user) {
        return null;
    }

    const { password, ...safe } = user;

    return safe;

  }

  // Para login: incluye el passwordHash (select:false en la entidad)
  async findWithPasswordByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
      
  }
}
