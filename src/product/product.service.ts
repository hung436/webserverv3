import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Image } from 'src/cloudinary/entities/image.entity';
import { SizesService } from 'src/sizes/sizes.service';
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
    private sizeService: SizesService,
    private categoriesService: CategoriesService,
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
          if (files) {
            for (const file of files) {
              const result = await this.CloudinaryService.uploadImage(file);

              const image = new Image();
              image.imageLink = result.secure_url;
              image.publicId = result.public_id;
              await this.imageRepository.save(image);
              images.push(image);
            }
          }

          // console.log(size);

          const newProduct = new Product();
          const category = await this.categoriesService.findOne(
            parseInt(product.category),
          );
          newProduct.name = product.name;
          newProduct.promotionPrice = product.promotionPrice;
          newProduct.description = product.description;
          newProduct.quantity = product.quantity;
          newProduct.title = product.title;
          newProduct.category = category;
          newProduct.images = images;

          await this.productRepository.save(newProduct);
          const prices = JSON.parse(product.prices);
          if (prices) {
            for (const price of prices) {
              const newProductToSize = new ProductToSize();
              const size = await this.sizeService.findOne(price.size);
              newProductToSize.price = parseInt(price.price);
              newProductToSize.size = size;
              newProductToSize.product = newProduct;
              await this.proToSizeRepository.save(newProductToSize);
            }
          }

          resolve({ success: true, message: 'Create product successfully' });
        } else {
          resolve({ success: false, message: 'Name already exists' });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  async findAll(papeSizes = 999, pageIndex = 0) {
    const [items, count] = await this.productRepository.findAndCount({
      skip: papeSizes * pageIndex,
      take: papeSizes,
      relations: {
        images: true,
        category: true,
        productToSizes: { size: true },
      },
      order: { created_at: 'DESC' },
    });
    return {
      success: true,
      message: 'Get product successfully',
      data: items,
      totalCountItem: count,
    };
  }

  async findOne(id: number) {
    const data = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        images: true,
        category: true,
        productToSizes: { size: true },
      },
    });
    return {
      success: true,
      message: 'Get product by id= ' + id + ' successfully',
      data: data,
    };
  }

  update(
    id: number,
    product: UpdateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    return new Promise<object>(async (resolve) => {
      try {
        console.log('pr', product);
        const check = await this.productRepository.findOne({
          where: { id: id },
        });
        if (check) {
          const images: any = [];
          if (files) {
            for (const file of files) {
              const result = await this.CloudinaryService.uploadImage(file);
              console.log(result);
              const image = await this.imageRepository.findOne({
                where: { productId: id },
              });
              image.imageLink = result.secure_url;
              image.publicId = result.public_id;
              await this.imageRepository.save(image);
              images.push(image);
            }
          }

          const Product = await this.productRepository.findOne({
            where: { id: id },
          });
          const category = await this.categoriesService.findOne(
            parseInt(product.category),
          );
          Product.name = product.name;
          Product.promotionPrice = product.promotionPrice;
          Product.description = product.description;
          Product.quantity = product.quantity;
          Product.title = product.title;
          Product.category = category;

          await this.productRepository.save(Product);
          const prices = JSON.parse(product.prices);
          if (prices) {
            for (const price of prices) {
              const newProductToSize = new ProductToSize();
              const size = await this.sizeService.findOne(price.size);
              newProductToSize.price = parseInt(price.price);
              newProductToSize.size = size;
              newProductToSize.product = Product;
              await this.proToSizeRepository.save(newProductToSize);
            }
          }

          resolve({ success: true, message: 'Update product successfully' });
        } else {
          resolve({ success: false, message: 'Name not exists' });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  async remove(id: number) {
    try {
      const check = await this.productRepository.findOne({ where: { id: id } });
      if (check) {
        await this.productRepository.delete({ id: id });
        return { success: true, message: 'Delete Product successfully' };
      } else {
        return { success: false, message: 'Product not exist' };
      }
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
