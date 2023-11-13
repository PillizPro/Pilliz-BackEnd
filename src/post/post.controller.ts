import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { PostService } from './post.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Posting')
@Controller('post')
export class PostController {
  constructor(private readonly PostService: PostService) { }

  @Post('posting')
  async postByUser(@Body() createPostDto: CreatePostDto) {
    return await this.PostService.postByUser(createPostDto)
  }

  @Get('findallpost')
  async findAllPosts() {
    return await this.PostService.findAllPosts();
  }

  @Get(':id')
  async findPostById(@Param('id') postId: string) {
    return await this.PostService.findPostById(postId);
  }
}