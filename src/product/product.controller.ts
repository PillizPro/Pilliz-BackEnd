import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
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
}
