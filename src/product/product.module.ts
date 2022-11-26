import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Image } from 'src/cloudinary/entities/image.entity';
import { ProductToSize } from './entities/productToSize.entity';
import { SizesService } from 'src/sizes/sizes.service';
import { Size } from 'src/sizes/entities/size.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';

// import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Image, ProductToSize, Size, Category]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    CloudinaryService,
    SizesService,
    CategoriesService,
  ],
})
export class ProductModule {}
