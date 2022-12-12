import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  Res,
  Get,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Signup } from './dto/signup.dto';
import { Signin } from './dto/signin.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from './enums/role.enum';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body(ValidationPipe) createAuthDto: Signin,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signin(createAuthDto);
    res.cookie('refreshToken', data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 31,
      sameSite: 'lax',
      httpOnly: true,
    });
    delete data.refreshToken;
    return data;
  }

  @Post('signup')
  signup(@Body(ValidationPipe) createAuthDto: Signup) {
    return this.authService.signup(createAuthDto);
  }
  @Post('facebook')
  async loginfacebook(
    @Body(ValidationPipe) body,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const data = await this.authService.signinFacebook(body, res);

      return new ResponseSuccess('LOGIN.FACEBOOK.SUCCESS', data);
    } catch (error) {
      return new ResponseError('LOGIN.ERROR', error);
    }
  }
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['id']);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];

    const data = await this.authService.refreshTokens(
      userId,
      refreshToken,
      res,
    );

    return data;
  }
  @Get('forgot-password/:email')
  async sendEmailForgotPassword(@Param() params): Promise<any> {
    try {
      const isEmailSent = await this.authService.sendEmailForgotPassword(
        params.email,
      );
      if (isEmailSent) {
        return new ResponseSuccess('LOGIN.EMAIL_RESENT', null);
      } else {
        return new ResponseError('REGISTRATION.ERROR.MAIL_NOT_SENT');
      }
    } catch (error) {
      return new ResponseError('LOGIN.ERROR.SEND_EMAIL', error);
    }
  }
}
