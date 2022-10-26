import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  title: string;

  image: string;
  price: string;
  promotionPrice: string;
  quantity: string;
  description: string;
  size: number;
}
