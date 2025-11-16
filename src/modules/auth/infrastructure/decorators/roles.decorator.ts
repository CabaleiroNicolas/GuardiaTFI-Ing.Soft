// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';


export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);