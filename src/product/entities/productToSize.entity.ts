import { Size } from 'src/sizes/entities/size.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductToSize {
  @PrimaryGeneratedColumn()
  postToCategoryId: number;

  @Column({ default: null })
  productId: number;

  @Column({ default: null })
  sizeId: number;

  @Column()
  price: number;

  @ManyToOne(() => Product, (product) => product.productToSizes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Size, (size) => size.productToSizes)
  size: Size;
}
