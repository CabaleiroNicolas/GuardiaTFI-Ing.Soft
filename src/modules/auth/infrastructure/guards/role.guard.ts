// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lee los roles requeridos desde el decorador
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, el endpoint es público (o solo requiere estar logueado)
    if (!requiredRoles) {
      return true;
    }

    // Obtener el usuario del request (inyectado previamente por el JWT Strategy)
    const { user } = context.switchToHttp().getRequest();

    // OJO: Asegúrate de que tu JWT payload incluya el campo 'roles' o 'role'
    // Si el usuario tiene un solo rol, adáptalo a un array si es necesario.
    
    if (!user || !user.role) {
        // Si no hay usuario o no tiene roles definidos, denegar acceso
        return false; 
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoles.some((role) => user.role == role);
  }
}