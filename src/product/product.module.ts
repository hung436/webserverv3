import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Image } from 'src/cloudinary/entities/image.entity';
import { ProductToSize } from './entities/productToSize.entity';
// import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image, ProductToSize])],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService],
})
export class ProductModule {}
