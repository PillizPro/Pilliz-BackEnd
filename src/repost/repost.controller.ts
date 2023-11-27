import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { RepostDto } from './dto/repost.dto'
import { RepostService } from './repost.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Reposting')
@Controller('reposting')
export class RepostController {
  constructor(private readonly repostService: RepostService) {}

  @Post('repost')
  async repostPost(@Body() repostDto: RepostDto) {
    return await this.repostService.repost(repostDto)
  }

  @Post('unrepost')
  async unrepostPost(@Body() repostDto: RepostDto) {
    return await this.repostService.unrepost(repostDto)
  }

  @Get('repostedPosts/:userId')
  async getRepostedPostsByUser(@Param('userId') userId: string) {
    return await this.repostService.getRepostedPostsByUser(userId)
  }

  @Get('repostedComments/:userId')
  async getRepostedCommentsByUser(@Param('userId') userId: string) {
    return await this.repostService.getRepostedCommentsByUser(userId)
  }
}
