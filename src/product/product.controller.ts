import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { ProductService } from './product.service'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('findAllProducts')
  async findAllProducts() {
    return await this.productService.findAllProducts()
  }

  @Get('searchProducts')
  async searchProducts(@Query('product') queryProduct: string) {
    return await this.productService.searchProducts(queryProduct)
  }

  @Get('isFavourite/:productId')
  async isFavourite(
    @Param('productId', new ParseUUIDPipe()) productId: string
  ) {
    return await this.productService.isProductFavourite(productId)
  }

  @Get('isAddedToCart/:productId')
  async isAddedToCart(
    @Param('productId', new ParseUUIDPipe()) prodcutId: string
  ) {
    return await this.productService.isProductAddedToCart(prodcutId)
  }

  @Get('recoveringAllTags')
  async recoveringAllTags() {
    return await this.productService.recoveringAllProductTags()
  }
}
