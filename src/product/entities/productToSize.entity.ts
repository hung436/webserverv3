import { Size } from 'src/sizes/entities/size.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductToSize {
  @PrimaryGeneratedColumn()
  public postToCategoryId!: number;

  @Column({ default: null })
  public productId!: number;

  @Column({ default: null })
  public sizeId!: number;

  @Column()
  public price!: number;

  @ManyToOne(() => Product, (product) => product.productToSizes)
  public product!: Product;

  @ManyToOne(() => Size, (size) => size.productToSizes)
  public size!: Size;
}
