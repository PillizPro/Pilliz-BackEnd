import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { LikePostDto } from './dto/like-post.dto'
import { LikeService } from './like.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Liking')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('likepost')
  async likePost(@Body() likePostDto: LikePostDto) {
    return await this.likeService.likePost(likePostDto)
  }

  @Post('unlikepost')
  async unlikePost(@Body() likePostDto: LikePostDto) {
    return await this.likeService.unlikePost(likePostDto)
  }

  @Get('likedPosts/:userId')
  async getLikedPostsByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string
  ) {
    return await this.likeService.getLikedPostsByUser(userId)
  }
}
