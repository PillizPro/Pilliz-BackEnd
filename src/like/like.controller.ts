import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { LikePostDto } from './dto/like-post.dto'
import { LikeService } from './like.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Liking')
@Controller('liking')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Post('like')
  async likePost(@Body() likePostDto: LikePostDto) {
    return await this.likeService.like(likePostDto)
  }

  @Post('unlike')
  async unlikePost(@Body() likePostDto: LikePostDto) {
    return await this.likeService.unlike(likePostDto)
  }

  @Get('likedPosts/:userId')
  async getLikedPostsByUser(@Param('userId') userId: string) {
    return await this.likeService.getLikedPostsByUser(userId)
  }

  @Get('likedComments/:userId')
  async getLikedCommentsByUser(@Param('userId') userId: string) {
    return await this.likeService.getLikedCommentsByUser(userId)
  }
}
