import { ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import { ProductService } from './product.service'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('findAllProducts')
  async findAllProducts() {
    return await this.productService.findAllProducts()
  }
}
