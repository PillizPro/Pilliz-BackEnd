import { Body, Controller, Post, Get } from '@nestjs/common'
import { RepostDto } from './dto/repost.dto'
import { RepostService } from './repost.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Reposting')
@Controller('reposting')
export class RepostController {
  constructor(private readonly repostService: RepostService) {}

  @Post('repost')
  async repost(@Body() repostDto: RepostDto, @CurrentUserId() userId: string) {
    return await this.repostService.repost(repostDto, userId)
  }

  @Post('unrepost')
  async unrepost(
    @Body() repostDto: RepostDto,
    @CurrentUserId() userId: string
  ) {
    return await this.repostService.unrepost(repostDto, userId)
  }

  @Get('repostedPosts')
  async getRepostedPostsByUser(@CurrentUserId() userId: string) {
    return await this.repostService.getRepostedPostsByUser(userId)
  }

  @Get('repostedComments')
  async getRepostedCommentsByUser(@CurrentUserId() userId: string) {
    return await this.repostService.getRepostedCommentsByUser(userId)
  }
}
