import { Category } from 'src/categories/entities/category.entity';
import { Image } from 'src/cloudinary/entities/image.entity';
import { OrderDetails } from 'src/order/entities/orderDetail.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductToSize } from './productToSize.entity';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  name: string;
  @Column()
  categoryId: number;

  @Column({ default: null })
  promotionPrice: string;
  @Column({ default: null })
  price: string;

  @Column({ default: null })
  quantity: string;
  @Column({ default: null })
  description: string;
  @Column({ default: null })
  active: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
  @OneToMany(() => ProductToSize, (producttosize) => producttosize.product)
  productToSizes: ProductToSize[];
  @OneToMany(() => Image, (image) => image.product)
  images: Image[];
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
