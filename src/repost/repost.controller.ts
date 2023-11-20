import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { RepostDto } from './dto/repost.dto'
import { RepostService } from './repost.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Reposting')
@Controller('repost')
export class RepostController {
  constructor(private readonly repostService: RepostService) { }

  @Post('repostPost')
  async repostPost(@Body() repostDto: RepostDto) {
    return await this.repostService.repostPost(repostDto)
  }

  @Post('unrepostPost')
  async unrepostPost(@Body() repostDto: RepostDto) {
    return await this.repostService.unrepostPost(repostDto)
  }


  @Get('repostededPosts/:userId')
  async getRepostedPostsByUser(@Param('userId') userId: string) {
    return await this.repostService.getRepostedPostsByUser(userId)
  }
}
