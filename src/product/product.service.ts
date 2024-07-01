import { ProductEntity } from './entities/product.entity'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllProducts() {
    try {
      const products = await this.prismaService.product.findMany({
        include: { ProductTags: true },
      })

      const entitiesProducts = products.map((product) => {
        const productTags = product.ProductTags.map((tag) => tag.name)
        return new ProductEntity({ ...product, productTags })
      })
      return entitiesProducts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting products')
    }
  }

  async searchProducts(queryProduct: string) {
    try {
      const products = await this.prismaService.product.findMany({
        take: 50,
        where: { titleLowercase: { contains: queryProduct.toLowerCase() } },
        include: { ProductTags: true },
      })
      const entitiesProducts = products.map((product) => {
        const productTags = product.ProductTags.map((tag) => tag.name)
        return new ProductEntity({ ...product, productTags })
      })
      return entitiesProducts
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when searching for products')
    }
  }

  async isProductFavourite(productId: string) {
    const product = await this.prismaService.product.findUniqueOrThrow({
      where: { id: productId },
    })
    await this.prismaService.product.update({
      where: { id: productId },
      data: { isFavourite: !product.isFavourite },
    })
  }

  async isProductAddedToCart(productId: string) {
    const product = await this.prismaService.product.findUniqueOrThrow({
      where: { id: productId },
    })
    await this.prismaService.product.update({
      where: { id: productId },
      data: { isAddedToCart: !product.isAddedToCart },
    })
  }

  async recoveringAllProductTags() {
    const productTags = await this.prismaService.productTags.findMany()
    const transformedProductTags = productTags.map((tag) => tag.name)
    return transformedProductTags
  }
}
