import { Size } from 'src/sizes/entities/size.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column({ default: null })
  image: string;

  @Column()
  price: string;

  @Column({ default: null })
  promotionPrice: string;

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
  @ManyToMany(() => Size)
  @JoinTable()
  size: Size[];
}
