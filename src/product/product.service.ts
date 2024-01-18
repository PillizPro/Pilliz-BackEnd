import { ProductEntity } from './entities/product.entity'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllProducts() {
    try {
      const products = await this.prismaService.product.findMany()

      const entitiesProducts = products.map(
        (product) => new ProductEntity(product)
      )
      return entitiesProducts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting products')
    }
  }

  async searchProducts(queryProduct: string) {
    // mettre tout en minuscule lors de la recherche et de la mise en base des produits
    try {
      const products = await this.prismaService.product.findMany({
        take: 10,
        where: { title: { startsWith: queryProduct } },
      })
      const entitiesProducts = products.map(
        (product) => new ProductEntity(product)
      )
      return entitiesProducts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when searching for products')
    }
  }
}
