import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Product } from 'src/product/entities/product.entity';
import { Like, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetail.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
  ) {}
  async create(id: number, orders) {
    try {
      const arrOrder = [];
      for (const order of orders.products) {
        const product = await this.productRepository.findOne({
          where: { id: order.id },
        });
        const newOrderDetails = new OrderDetails();
        newOrderDetails.price = order.price;
        newOrderDetails.quantity = order.quantity;
        newOrderDetails.product = product;
        newOrderDetails.size = order.size;
        newOrderDetails.imageLink = order.image;
        await this.orderDetailsRepository.save(newOrderDetails);
        arrOrder.push(newOrderDetails);
      }
      const newOrder = new Order();

      newOrder.userId = id;
      newOrder.status = 1;
      newOrder.totalPrice = orders.total;
      newOrder.orderDetails = arrOrder;
      newOrder.address = orders.address;
      newOrder.phone = orders.phone;
      newOrder.methor_payment = 'Thanh toan khi nhan hang';
      await this.orderRepository.save(newOrder);
      return { success: true };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    papeSizes = 5,
    pageIndex = 0,
    searchText: string,
    orderBy = 'created_at+',
  ) {
    let dataWhere: object = {};
    if (searchText) {
      dataWhere = { name: Like(`%${searchText}%`) };
    }
    const orderData = {};
    if (orderBy) {
      orderBy.slice(-1) === '-'
        ? (orderData[orderBy.substring(0, orderBy.length - 1)] = 'ASC')
        : (orderData[orderBy.substring(0, orderBy.length - 1)] = 'DESC');
    }

    const [items, count] = await this.orderRepository.findAndCount({
      skip: papeSizes * pageIndex,
      take: papeSizes,
      relations: {
        orderDetails: { product: true },
        user: true,
      },
      where: dataWhere,
      // (params && params.categoryId) || searchText
      //   ? { name: Like(`%${searchText}%`), categoryId: 2 }
      //   : {},
      order: orderData,
    });
    return {
      success: true,
      message: 'Get order successfully',
      data: items,
      totalCountItem: count,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.update(id, updateOrderDto);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
