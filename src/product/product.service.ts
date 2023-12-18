import { ProductEntity } from './entities/product.entity'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllProducts() {
    try {
      const products = await this.prismaService.product.findMany()

      const entitiesProducts = products.map((product) => {
        const p = new ProductEntity(product)
        return p
      })
      return entitiesProducts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting products')
    }
  }
}
