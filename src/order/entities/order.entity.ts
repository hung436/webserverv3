import { Product } from 'src/product/entities/product.entity';
import { Size } from 'src/sizes/entities/size.entity';
import { User } from 'src/users/entities/user.entity';
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
import { OrderDetails } from './orderDetail.entity';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  userId: number;

  @Column({ default: null })
  note: string;
  @Column({ default: null })
  methor_payment: string;
  @Column({ default: null })
  address: string;
  @Column({ default: null })
  phone: string;
  @Column({ default: null })
  status: number;
  @Column({ default: null })
  totalPrice: string;
  @Column({
    default: null,
  })
  estimatedDeliveryDate: Date;
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
  // @ManyToMany(() => Size)
  // @JoinTable()
  // size: Size[];
  @ManyToOne(() => User, (user) => user.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetails[];
}
