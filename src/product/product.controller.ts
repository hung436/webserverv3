import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { request } from 'http';
import { Request } from 'express';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  // @UseGuards(AccessTokenGuard)
  // @Roles(Role.Admin)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() body,

    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.create(body, files);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  @UseGuards(AccessTokenGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
  @UseGuards(AccessTokenGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove();
  }
}
