import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  Res,
  Get,
  HttpCode,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Signup } from './dto/signup.dto';
import { Signin } from './dto/signin.dto';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body(ValidationPipe) createAuthDto: Signin) {
    console.log(createAuthDto);
    return this.authService.signin(createAuthDto);
  }
  @Post('signup')
  signup(@Body(ValidationPipe) createAuthDto: Signup) {
    return this.authService.signup(createAuthDto);
  }
  @Post('refresh')
  refresh(@Req() request: Request, @Res() response: Response) {
    console.log('hun');
    return this.authService.refresh(response, request.cookies.refreshToken);
  }
}
