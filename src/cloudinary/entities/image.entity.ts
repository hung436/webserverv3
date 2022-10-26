import { Product } from 'src/product/entities/product.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  productId: number;

  @Column()
  imageLink: string;
  @Column()
  publicId: string;
  @Column({ default: null })
  description: string;
  @Column({ default: null })
  imageDefaut: number;
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
  // @ManyToMany(() => Size)
  // @JoinTable()
  // size: Size[];
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
