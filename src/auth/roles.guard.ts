import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
private isAllowed(userRole: Role, required: Role[]) {
  if (userRole === Role.SUPER_ADMIN) {
    return required.includes(Role.SUPER_ADMIN) || required.includes(Role.ADMIN);
  }
  return required.includes(userRole);
}
   canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!required || required.length === 0) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!user?.role) return false;

    // return user && required.includes(user.role);
    return this.isAllowed(user.role, required);
  }
}
