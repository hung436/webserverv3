import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { ForgotPassword } from './entities/forgotpassword.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ForgotPassword]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
