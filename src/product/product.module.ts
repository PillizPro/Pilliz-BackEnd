import { Module } from '@nestjs/common'
import { ImageUploadModule } from 'src/image/image-upload.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [ImageUploadModule], // Ajoutez ImageUploadModule aux imports
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
