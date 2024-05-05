import { ApiHideProperty } from '@nestjs/swagger'
import { Product } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class ProductEntity implements Product {
  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial)
  }
  id: string
  title: string
  @ApiHideProperty()
  @Exclude()
  titleLowercase: string
  price: number
  description: string
  images: string[]
  rating: number
  isFavourite: boolean
  isPopular: boolean
  isAddedToCart: boolean
  productTags: string[]
}
