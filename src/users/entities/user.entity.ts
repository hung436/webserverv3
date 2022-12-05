import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  avartar: string;

  @Column()
  email: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: null })
  id_facebook: string;
  @Column({ default: 'user' })
  role: string;

  @Column({ default: null })
  refreshToken: string;

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

  @OneToMany(() => Order, (order) => order.user, {
    // cascade: true,
    // onDelete: 'CASCADE',
  })
  order: Order[];
}
