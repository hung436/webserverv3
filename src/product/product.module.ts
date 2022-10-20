import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
