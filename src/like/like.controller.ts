import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { LikePostDto } from './dto/like-post.dto'
import { LikeService } from './like.service'
import { ApiTags } from '@nestjs/swagger'


@ApiTags('Liking')
@Controller('like')
export class LikeController {
  constructor(private readonly LikeService: LikeService) { }

  @Post('likepost')
  async likePost(@Body() likePostDto: LikePostDto) {
    return await this.LikeService.likePost(likePostDto)
  }

  @Post('unlikepost')
  async unlikePost(@Body() likePostDto: LikePostDto) {
    return await this.LikeService.unlikePost(likePostDto)
  }

  @Get('likedPosts/:userId')
  async getLikedPostsByUser(@Param('userId') userId: string) {
    return await this.LikeService.getLikedPostsByUser(userId);
  }

}