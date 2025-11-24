import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      console.error('Error retrieving categories:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.category.findUnique({
        where: { id },
      });
    } catch (error) {
      if (PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Category with id ${id} not found.`);
      } else {
        console.error(`Error retrieving category with id ${id}:`, error);
        throw error;
      }
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Category with id ${id} not found.`);
      } else {
        console.error(`Error updating category with id ${id}:`, error);
        throw error;
      }
    }
  }

  remove(id: number) {
    try {
      return this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Category with id ${id} not found.`);
      } else {
        console.error(`Error deleting category with id ${id}:`, error);
        throw error;
      }
    }
  }
}
