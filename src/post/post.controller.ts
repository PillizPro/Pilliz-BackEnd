import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { PostService } from './post.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Posting')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post('posting')
  async postByUser(@Body() createPostDto: CreatePostDto) {
    return await this.postService.postByUser(createPostDto)
  }

  @Get('findallpost')
  async findAllPosts() {
    return await this.postService.findAllPosts()
  }

  @Get('find20LastsPosts')
  async find20LastsPosts() {
    return await this.postService.find20LastsPosts()
  }

  @Get('findPostInfo:id')
  async findPostById(@Param('id') postId: string) {
    return await this.postService.findPostById(postId)
  }

  @Get('find20RecentsPosts:date')
  async find20RecentsPosts(@Param('date') dateString: Date) {
    return await this.postService.find20RecentsPosts(dateString);
  }

  @Get('find20OlderPosts:date')
  async find20OlderPosts(@Param('date') dateString: Date) {
    return await this.postService.find20OlderPosts(dateString);
  }
}
