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
    @Body(ValidationPipe) body: CreateProductDto,

    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.create(body, files);
  }

  @Get()
  findAll(@Query() data) {
    const { pageIndex, pageSizes, searchText, orderBy, params } = data;
    const paramsJson = params ? JSON.parse(params) : {};
    return this.productService.findAll(
      pageSizes,
      pageIndex,
      searchText,
      orderBy,
      paramsJson,
    );
  }

  @Get('getbyid')
  findOne(@Query('id') id: string) {
    console.log(id);
    return this.productService.findOne(+id);
  }
  // @UseGuards(AccessTokenGuard)
  // @Roles(Role.Admin)
  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.update(+id, updateProductDto, files);
  }
  @UseGuards(AccessTokenGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
