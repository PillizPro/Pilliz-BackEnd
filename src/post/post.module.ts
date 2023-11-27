import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { ImageUploadModule } from 'src/image/image-upload.module'

@Module({
  imports: [ImageUploadModule], // Ajoutez ImageUploadModule aux imports
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
