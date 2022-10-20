import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../auth/decorator/roles.decorator';

import { Role } from '../../auth/enums/role.enum';
import { AccessTokenGuard } from './accessToken.guard';

@Injectable()
export class RolesGuard extends AccessTokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('user', user);
    return this.matchRoles(requiredRoles, user);
  }
  matchRoles = (roles: any, role: number): boolean => {
    return true;
  };
}
// import { Role } from 'src/auth/enums/role.enum';
// import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
// import RequestWithUser from '../authentication/requestWithUser.interface';

// export const RolesGuard = (role: Role): Type<CanActivate> => {
//   class RoleGuardMixin implements CanActivate {
//     canActivate(context: ExecutionContext) {
//       const request = context.switchToHttp().getRequest();
//       const user = request.user;

//       return user?.roles.includes(role);
//     }
//   }

//   return mixin(RoleGuardMixin);
// };
