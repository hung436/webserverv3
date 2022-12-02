import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.userRepository.create(createUserDto);
        resolve({
          success: true,
          message: 'Created successfully',
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: { order: { orderDetail: { product: true } } },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const result = this.userRepository.update(id, updateUserDto);
        // .createQueryBuilder()
        // .update({})
        // .where({
        //   id: id,
        // })
        // .returning('*')
        // .execute();
        resolve({ success: true, message: 'Success' });
      } catch (error) {}
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
