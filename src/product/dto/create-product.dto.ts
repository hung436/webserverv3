import { IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prices: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  promotionPrice: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  category: string;
  quantity: string;
}
