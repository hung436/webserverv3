import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './entities/size.entity';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size) private sizeRepository: Repository<Size>,
  ) {}
  create(createSizeDto: CreateSizeDto) {
    const newSize = new Size();
    newSize.name = createSizeDto.name;
    newSize.description = createSizeDto.description;
    newSize.active = createSizeDto.active;

    // return this.sizeRepository.save(createSizeDto);
    return;
  }

  findAll() {
    return `This action returns all sizes`;
  }

  findOne(id: number) {
    return this.sizeRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateSizeDto: UpdateSizeDto) {
    return `This action updates a #${id} size`;
  }

  remove(id: number) {
    return `This action removes a #${id} size`;
  }
}
