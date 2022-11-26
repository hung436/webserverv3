import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rejects } from 'assert';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<object> {
    try {
      const check = await this.categoryRepository.findOne({
        where: { name: createCategoryDto.name },
      });

      if (!check) {
        const category = new Category();
        category.name = createCategoryDto.name;
        category.description = createCategoryDto.description;
        await this.categoryRepository.save(category);
        return {
          success: true,
          message: 'Create Category successfully',
        };
      }
      return { success: false, message: 'Category name is exist' };
    } catch (error) {}
  }

  async findAll() {
    const data = await this.categoryRepository.find();
    return data;
  }

  async findOne(id: number) {
    return this.categoryRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return new Promise(async (rejects) => {
      try {
        const check = await this.categoryRepository.findOne({
          where: { id: id },
        });
        if (check) {
          await this.categoryRepository.update(
            { id: id },
            { name: updateCategoryDto.name },
          );
          rejects({ success: true, message: 'Update category successfully' });
        }
      } catch (error) {}
    });
  }

  async remove(id: number) {
    try {
      await this.categoryRepository.delete(id);
      return {
        success: true,
        message: 'Delete successfully completed',
      };
    } catch (error) {}
  }
}
