import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  Res,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Signup } from './dto/signup.dto';
import { Signin } from './dto/signin.dto';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enums/role.enum';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

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
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['id']);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    // console.log(req.user);
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
