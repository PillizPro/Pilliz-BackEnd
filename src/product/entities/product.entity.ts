import { Product } from '@prisma/client'

export class ProductEntity implements Product {
  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial)
  }
  id: string;
  title: string;
  price: number;
  description: string;
  images: string;
  rating: number;
  isFavourite: boolean;
  isPopular: boolean;
}
