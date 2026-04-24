import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../domain/user/entities/user.entity';
import { Role } from '../../domain/user/entities/role.entity';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied');
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role.name);
      if (!hasRole) {
        throw new ForbiddenException('Insufficient role privileges');
      }
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = user.role.permissions || [];
      const hasAllPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}