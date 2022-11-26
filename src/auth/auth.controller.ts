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
    const data = await this.authService.signinFacebook(body);
    res.cookie('refreshToken', data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 31,
      sameSite: 'lax',
      httpOnly: true,
    });
    delete data.refreshToken;
    return this.authService.signinFacebook(body);
  }
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['id']);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    const { data } = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie('refreshToken', data.refreshToken, {
      // expires: new Date(new Date().getTime() + 30 * 1000),
      maxAge: 1000 * 3600,
      sameSite: 'strict',
      httpOnly: true,
    });
    delete data.refreshToken;

    return data;
  }
  @Get('forgot-password/:email')
  async sendEmailForgotPassword(@Param() params): Promise<any> {
    try {
      const isEmailSent = await this.authService.sendEmailForgotPassword(
        params.email,
      );
      return { success: true };
    } catch (error) {}
  }
}
