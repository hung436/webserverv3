import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import console from 'console';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Image } from 'src/cloudinary/entities/image.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductToSize } from './entities/productToSize.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(ProductToSize)
    private proToSizeRepository: Repository<ProductToSize>,
    private CloudinaryService: CloudinaryService,
  ) {}
  create(
    product: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<object> {
    return new Promise<object>(async (resolve) => {
      try {
        const check = await this.productRepository.findOne({
          where: { name: product.name },
        });
        if (!check) {
          const images: any = [];
          for (const file of files) {
            const result = await this.CloudinaryService.uploadImage(file);
            const image = new Image();
            image.imageLink = result.secure_url;
            image.publicId = result.public_id;
            await this.imageRepository.save(image);
            images.push(image);
          }
          const newProductToSize = new ProductToSize();
          newProductToSize.price = parseInt(product.price);
          newProductToSize.sizeId = product.size;
          await this.proToSizeRepository.save(newProductToSize);

          const newProduct = new Product();

          newProduct.name = product.name;
          newProduct.promotionPrice = product.promotionPrice;
          newProduct.description = product.description;
          newProduct.quantity = product.quantity;
          newProduct.title = product.title;
          newProduct.images = images;
          newProduct.productToSizes = [newProductToSize];

          await this.productRepository.save(newProduct);
          resolve({ success: true, message: 'Create product successfully' });
        } else {
          resolve({ success: false, message: 'Name already exists' });
        }
      } catch (error) {
        throw new Error(error);
      }
    });
  }

  findAll() {
    return this.productRepository.find({
      relations: { images: true, category: true, productToSizes: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove() {
    return;
  }
}
