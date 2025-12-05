import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    const { categoryId, ...data } = createTransactionDto;

    try {
      return await this.prisma.transaction.create({
        data: {
          ...data,
          category: {
            connect: { id: categoryId },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      console.log('Error creating transaction: ', error);
      throw new BadRequestException(error.message);
    }
  }

  async findAll(userId: number) {
    try {
      return await this.prisma.transaction.findMany({
        where: { userId },
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.log('Error retrieving transactions: ', error);
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.transaction.findUnique({
        where: { id },
      });
    } catch (error) {
      if (PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Transaction with id ${id} not found.`);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const { categoryId, ...data } = updateTransactionDto;

      return await this.prisma.transaction.update({
        where: { id },
        data: {
          ...data,
          ...(categoryId !== undefined && {
            category: {
              connect: { id: categoryId },
            },
          }),
        },
      });
    } catch (error) {
      if (PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Transaction with id ${id} not found.`);
      } else {
        console.log('Error updating transaction: ', error);
        throw new BadRequestException(error.message);
      }
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.transaction.delete({
        where: { id },
      });
    } catch (error) {
      if (PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Transaction with id ${id} not found.`);
      } else {
        console.log('Error deleting transaction: ', error);
        throw new BadRequestException(error.message);
      }
    }
  }
}
