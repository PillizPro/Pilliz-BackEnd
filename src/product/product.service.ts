import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllProducts() {
    try {
      const products = await this.prismaService.product.findMany()

      const entitiesProducts = products.map((product) => {
        new ProductEntity(product)
      })
      return entitiesProducts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting products')
    }
  }
}
