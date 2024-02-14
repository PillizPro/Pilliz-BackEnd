import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { FollowService } from './follow.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateFollowDto } from './dto/create-follow.dto'
import { DeleteFollowDto } from './dto/delete-follow.dto'

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('followUser')
  async followUser(@Body() createFollowDto: CreateFollowDto) {
    return await this.followService.createFollowers(createFollowDto)
  }

  @Post('unfollowUser')
  async unfollowUser(@Body() deleteFollowDto: DeleteFollowDto) {
    return await this.followService.deleteFollowers(deleteFollowDto)
  }

  @Get('userNbFollowers/:userId')
  async getUserNbFollowers(@Param('userId') userId: string) {
    return await this.followService.getNbFollowers(userId)
  }

  @Get('userNbFollowing/:userId')
  async getUserNbFollowing(@Param('userId') userId: string) {
    return await this.followService.getNbFollowing(userId)
  }

  @Get('userFollowers/:userId')
  async getUserFollowers(@Param('userId') userId: string) {
    return await this.followService.getFollowers(userId)
  }
}
