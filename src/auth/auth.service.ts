import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Signup } from './dto/signup.dto';
import { Signin } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  // private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
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
            const payload = { name: user.name, id: user.id, role: user.role };
            const access_token = this.jwtService.sign(payload, {
              expiresIn: '15m',
              secret: process.env.JWT_SECRET,
            });
            const refresh_token = this.jwtService.sign(payload, {
              expiresIn: '7d',
              secret: process.env.JWT_SECRET,
            });
            console.log(access_token);
            resolve({
              success: true,
              message: 'Login successful',
              data: { access_token, refresh_token },
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
        console.log(user);
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
  refresh(res: Response, refresh_token: string) {
    return new Promise((resolve, reject) => {
      try {
        // res.cookie('jwt', refresh_token, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === 'production',
        //   sameSite: 'none',
        //   path: '/',
        //   maxAge: 60 * 60 * 24 * 3,
        // });
        resolve('abc');
      } catch (error) {
        reject(error);
      }
    });
  }
}
