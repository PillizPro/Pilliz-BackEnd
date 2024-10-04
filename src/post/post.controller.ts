import { Body, Controller, Post, Get } from '@nestjs/common'
import {
  CreatePostDto,
  DeletePostDto,
  RecoverDetailsPostDto,
  RecoverDatePostDto,
  PostOrCommentTypeDto,
  ViewInterractPostDto,
} from './dto'
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

  @Post('findPostInfo')
  async findPostById(
    @Body() recoverDetailsPostDto: RecoverDetailsPostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.findPostById(recoverDetailsPostDto, userId)
  }

  @Get('find20LastsPosts')
  async find20LastsPosts(@CurrentUserId() userId: string) {
    return await this.postService.find20LastsPosts(userId)
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

  @Get('find20LastsPostsFollowed')
  async find20LastsPostsFollowed(@CurrentUserId() userId: string) {
    return await this.postService.find20LastsPostsFollowed(userId)
  }

  @Post('find20RecentsPostsFollowed')
  async find20RecentsPostsFollowed(
    @Body() recoverDatePostDto: RecoverDatePostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.find20RecentsPostsFollowed(
      recoverDatePostDto,
      userId
    )
  }

  @Post('find20OlderPostsFollowed')
  async find20OlderPostsFollowed(
    @Body() recoverDatePostDto: RecoverDatePostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.find20OlderPostsFollowed(
      recoverDatePostDto,
      userId
    )
  }

  @Post('changePostOrCommentType')
  async changePostOrCommentType(
    @Body() postOrCommentTypeDto: PostOrCommentTypeDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.changePostOrCommentType(
      postOrCommentTypeDto,
      userId
    )
  }

  @Post('interractViewPost')
  async interractViewPost(
    @Body() viewInterractPostDto: ViewInterractPostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.postService.interractViewPost(
      viewInterractPostDto,
      userId
    )
  }
}
