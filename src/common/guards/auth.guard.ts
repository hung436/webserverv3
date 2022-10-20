// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly userService: UsersService) {}
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     return this.validateRequest(request);
//   }

//   async validateRequest(execContext: ExecutionContext): Promise<boolean> {
//     const request = execContext.switchToHttp().getRequest();
//     const user = request.user;
//     // console.log(await this.userService.findAll());
//     console.log('user', user);
//     return new Promise<boolean>((resolve, reject) => {
//       return true;
//     });
//   }
// }

// import { Role } from 'src/auth/enums/role.enum';
// import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
// import RequestWithUser from '../authentication/requestWithUser.interface';

// const RoleGuard = (role: Role): Type<CanActivate> => {
//   class RoleGuardMixin implements CanActivate {
//     canActivate(context: ExecutionContext) {
//       const request = context.switchToHttp().getRequest<RequestWithUser>();
//       const user = request.user;

//       return user?.roles.includes(role);
//     }
//   }

//   return mixin(RoleGuardMixin);
// };

// export default RoleGuard;
