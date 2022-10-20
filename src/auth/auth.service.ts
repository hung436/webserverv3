import { Injectable, ForbiddenException } from '@nestjs/common';
import { Signup } from './dto/signup.dto';
import { Signin } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  // private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async getTokens(id: number, email: string, role: number) {
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
}
