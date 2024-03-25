import { Body, Controller, Post, Get } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { DeletePostDto } from './dto/delete-post.dto'
import { RecoverPostDto } from './dto/recover-post.dto'
import { RecoverDetailsPostDto } from './dto/recover-details-post.dto'
import { RecoverDatePostDto } from './dto/recover-date-post.dto'
import { PostService } from './post.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Posting')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('posting')
  async postByUser(@Body() createPostDto: CreatePostDto) {
    return await this.postService.postByUser(createPostDto)
  }

  @Post('deletingPost')
  async deletePostById(@Body() deletePostDto: DeletePostDto) {
    return await this.postService.deletePostById(deletePostDto)
  }

  @Get('findallpost')
  async findAllPosts() {
    return await this.postService.findAllPosts()
  }

  @Post('find20LastsPosts')
  async find20LastsPosts(@Body() recoverPostDto: RecoverPostDto) {
    return await this.postService.find20LastsPosts(recoverPostDto)
  }

  @Post('findPostInfo')
  async findPostById(@Body() recoverDetailsPostDto: RecoverDetailsPostDto) {
    return await this.postService.findPostById(recoverDetailsPostDto)
  }

  @Post('find20RecentsPosts')
  async find20RecentsPosts(@Body() recoverDatePostDto: RecoverDatePostDto) {
    return await this.postService.find20RecentsPosts(recoverDatePostDto)
  }

  @Post('find20OlderPosts')
  async find20OlderPosts(@Body() recoverDatePostDto: RecoverDatePostDto) {
    return await this.postService.find20OlderPosts(recoverDatePostDto)
  }
}
