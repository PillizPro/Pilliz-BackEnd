import { Body, Controller, Post, Get } from '@nestjs/common'
import { LikePostDto } from './dto/like-post.dto'
import { LikeService } from './like.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Liking')
@Controller('liking')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('like')
  async likePost(
    @Body() likePostDto: LikePostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.likeService.like(likePostDto, userId)
  }

  @Post('unlike')
  async unlikePost(
    @Body() likePostDto: LikePostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.likeService.unlike(likePostDto, userId)
  }

  @Get('likedPosts')
  async getLikedPostsByUser(@CurrentUserId() userId: string) {
    return await this.likeService.getLikedPostsByUser(userId)
  }

  @Get('likedComments')
  async getLikedCommentsByUser(@CurrentUserId() userId: string) {
    return await this.likeService.getLikedCommentsByUser(userId)
  }
}
