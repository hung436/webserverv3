import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class Signin {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
