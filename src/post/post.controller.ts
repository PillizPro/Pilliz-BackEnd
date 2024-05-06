import { Body, Controller, Post, Get } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { DeletePostDto } from './dto/delete-post.dto'
import { RecoverDetailsPostDto } from './dto/recover-details-post.dto'
import { RecoverDatePostDto } from './dto/recover-date-post.dto'
import { PostService } from './post.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiBearerAuth()
@ApiTags('Posting')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('posting')
  async postByUser(
    @Body() createPostDto: CreatePostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.postByUser(createPostDto, userId)
  }

  @Post('deletingPost')
  async deletePostById(@Body() deletePostDto: DeletePostDto) {
    return await this.postService.deletePostById(deletePostDto)
  }

  @Get('findallpost')
  async findAllPosts() {
    return await this.postService.findAllPosts()
  }

  @Get('find20LastsPosts')
  async find20LastsPosts(@CurrentUserId() userId: string) {
    return await this.postService.find20LastsPosts(userId)
  }

  @Post('findPostInfo')
  async findPostById(
    @Body() recoverDetailsPostDto: RecoverDetailsPostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.findPostById(recoverDetailsPostDto, userId)
  }

  @Post('find20RecentsPosts')
  async find20RecentsPosts(
    @Body() recoverDatePostDto: RecoverDatePostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.find20RecentsPosts(recoverDatePostDto, userId)
  }

  @Post('find20OlderPosts')
  async find20OlderPosts(
    @Body() recoverDatePostDto: RecoverDatePostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.find20OlderPosts(recoverDatePostDto, userId)
  }
}
