import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllProducts() {
    try {
      const products = await this.prismaService.product.findMany({})

      return products
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting products')
    }
  }
}
