import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Signup } from './dto/signup.dto';
import { Signin } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { UsersService } from 'src/users/users.service';
import { ForgotPassword } from './entities/forgotpassword.entity';

@Injectable()
export class AuthService {
  // private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ForgotPassword)
    private readonly forgotRepository: Repository<ForgotPassword>,
    private jwtService: JwtService,
    private usersService: UsersService, // private configService: ConfigService,
  ) {}
  async signin({ email, password }: Signin) {
    return new Promise(async (resolve) => {
      try {
        const user = await this.userRepository.findOne({
          where: { email: email },
        });
        if (user && user.email) {
          const check = await bcrypt.compareSync(password, user.password);
          if (check) {
            const { accessToken, refreshToken } = await this.getTokens(
              user.id,
              user.email,
              user.role,
            );

            await this.updateRefreshToken(user.id, accessToken);

            resolve({
              success: true,
              message: 'Login successful',
              data: { accessToken, refreshToken },
            });
          } else resolve({ success: false, message: 'Password incorrect' });
        } else resolve({ success: false, message: 'Email incorrect' });
      } catch (err) {
        throw new Error(err);
      }
    });
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
  signup(user: Signup) {
    return new Promise(async (resolve) => {
      try {
        const check = await this.userRepository.findOne({
          where: { email: user.email },
        });
        if (!check) {
          const salt = await bcrypt.genSalt();
          const hashpassword = await this.hashPassword(user.password, salt);
          const newUser = await this.userRepository.create({
            email: user.email,
            password: hashpassword,
            name: user.name,
            phone: user.phone,
          });
          await this.userRepository.save(newUser);
          resolve({
            success: true,
            message: 'success',
          });
        } else {
          resolve({ success: false, message: 'Email already exists' });
        }
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await this.hashPassword(refreshToken, salt);
    return await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(id: number, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id, email, role },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { id, email, role },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.name, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  async sendEmailForgotPassword(email: string): Promise<boolean> {
    const userFromDb = await this.userRepository.findOne({
      where: { email: email },
    });
    // if (!userFromDb)
    //   throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    // const tokenModel = await this.createForgottenPasswordToken(email);
    if (true) {
      console.log(email);
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: '1951120080@sv.ut.edu.vn',
          pass: 'huynhhung436',
        },
      });
      const mailOptions = {
        from: '1951120080@sv.ut.edu.vn',
        to: email, // list of receivers (separated by ,)
        subject: 'Frogotten Password',
        text: 'Forgot Password',
        html:
          'Hi! <br><br> If you requested to reset your password<br><br>' +
          '<a href=' +
          'https://pizzafood.cf' +
          ':' +
          // config.host.port +
          '/auth/email/reset-password/' +
          // tokenModel.newPasswordToken +
          '>Click here</a>', // html body
      };
      const sent = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log('Message sent: %s', error);
            return reject(false);
          }
          console.log('Message sent: %s', info);
          resolve(true);
        });
      });
      return sent;
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async createForgottenPasswordToken(email: string) {
    const forgottenPassword = await this.forgotRepository.findOne({
      where: {
        email: email,
      },
    });
    if (
      forgottenPassword &&
      (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 <
        15
    ) {
      throw new HttpException(
        'RESET_PASSWORD.EMAIL_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const forgottenPasswordModel = await this.forgotRepository.update(
        { email: email },
        {
          email: email,
          newPasswordToken: (
            Math.floor(Math.random() * 9000000) + 1000000
          ).toString(), //Generate 7 digits number,
          timestamp: new Date(),
        },
        // {upsert: true, new: true}
      );
      if (forgottenPasswordModel) {
        return forgottenPasswordModel;
      } else {
        throw new HttpException(
          'LOGIN.ERROR.GENERIC_ERROR',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
