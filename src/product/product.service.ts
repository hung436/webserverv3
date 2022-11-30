import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Image } from 'src/cloudinary/entities/image.entity';
import { SizesService } from 'src/sizes/sizes.service';
import { Like, Repository } from 'typeorm';
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
        const prices = JSON.parse(product.prices);
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
          newProduct.price = prices[0].price;
          newProduct.category = category;
          newProduct.images = images;

          await this.productRepository.save(newProduct);

          if (prices && prices.length > 0) {
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

  async findAll(
    papeSizes = 5,
    pageIndex = 0,
    searchText: string,
    orderBy = 'created_at+',
    params: { categoryId: number },
  ) {
    let dataWhere: object = {};
    if (params && params.categoryId) {
      dataWhere = { categoryId: params.categoryId };
    }
    if (searchText) {
      dataWhere = { name: Like(`%${searchText}%`) };
    }
    const orderData = {};
    if (orderBy) {
      orderBy.slice(-1) === '-'
        ? (orderData[orderBy.substring(0, orderBy.length - 1)] = 'ASC')
        : (orderData[orderBy.substring(0, orderBy.length - 1)] = 'DESC');
    }

    const [items, count] = await this.productRepository.findAndCount({
      skip: papeSizes * pageIndex,
      take: papeSizes,
      relations: {
        images: true,
        category: true,
        productToSizes: { size: true },
      },
      where: dataWhere,
      // (params && params.categoryId) || searchText
      //   ? { name: Like(`%${searchText}%`), categoryId: 2 }
      //   : {},
      order: orderData,
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
        const check = await this.productRepository.findOne({
          where: { id: id },
        });
        if (check) {
          const images: any = [];
          //update file
          if (files) {
            for (const file of files) {
              const result = await this.CloudinaryService.uploadImage(file);

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

          Product.name = product.name;
          Product.promotionPrice = product.promotionPrice;
          Product.description = product.description;
          Product.quantity = product.quantity;
          Product.title = product.title;
          Product.categoryId = parseInt(product.category);

          await this.productRepository.save(Product);
          const prices = JSON.parse(product.prices);
          if (prices) {
            for (const price of prices) {
              const ProductToSize = await this.proToSizeRepository.findOne({
                where: { productId: id, sizeId: price.size },
              });

              ProductToSize.price = parseInt(price.price);

              await this.proToSizeRepository.save(ProductToSize);
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
