import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GeneralService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getGeneral() {
    const user = await this.userRepository.count();
    const product = await this.productRepository.count();
    const order = await this.orderRepository.count();

    const { sum } = await this.orderRepository
      .createQueryBuilder('orders')
      .select('SUM(orders.totalPrice)', 'sum')
      .where('orders.status=:status', { status: 5 })
      .getRawOne();
    return {
      user,
      product,
      order,
      revenue: sum,
    };
  }
}
