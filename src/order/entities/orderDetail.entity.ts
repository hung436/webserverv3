import { Product } from 'src/product/entities/product.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
@Entity('orderdetails')
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageLink: string;
  @Column()
  price: string;
  @Column()
  quantity: string;
  @Column()
  size: string;
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

  @ManyToOne(() => Order, (order) => order.orderDetail, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  order: Order;
  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;
}
