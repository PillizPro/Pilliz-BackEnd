import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { PostService } from './post.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Posting')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('posting')
  async postByUser(@Body() createPostDto: CreatePostDto) {
    return await this.postService.postByUser(createPostDto)
  }

  @Get('findallpost')
  async findAllPosts() {
    return await this.postService.findAllPosts()
  }

  @Get(':id')
  async findPostById(@Param('id', new ParseUUIDPipe()) postId: string) {
    return await this.postService.findPostById(postId)
  }
}
