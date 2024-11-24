import { Module } from '@nestjs/common'
import { ImageUploadModule } from 'src/image/image-upload.module'
import { StripeController } from './stripe.controller'
import { StripeService } from './stripe.service'

@Module({
  imports: [ImageUploadModule], // Ajoutez ImageUploadModule aux imports
  // controllers: [StripeController],
  // providers: [StripeService],
})
export class StripeModule { }
