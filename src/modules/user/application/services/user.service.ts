import { BadRequestException, GoneException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserService } from '../ports/user-service.interface';
import { User } from '../../domain/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, USER_REPOSITORIO } from '../ports/user-repository.interface';

@Injectable()
export class UserService implements IUserService {

  constructor(
    @Inject(USER_REPOSITORIO)
    private userRepo: IUserRepository,
  ) { }

  async createUser(email: string, password: string) {
    let newUser: User;

    const userAlreadyExists: boolean = !!(await this.findByEmail(email));

    if (userAlreadyExists) throw new BadRequestException('User already exists');

    if (password) {
      const hashedPassword: string = await bcrypt.hash(password, 12);
      newUser = new User({ email, password: hashedPassword });
    } else {
      throw new BadRequestException('Password is required');
    }

    await this.userRepo.save(newUser);
  }


  // Búsqueda “pública” (no devuelve password)
  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user: User | null = await this.userRepo.findByEmail(email);
    if (!user) {
      return null;
    }
    const { password, ...safe } = user;
    return safe;
  }

  async findWithPasswordByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

}
