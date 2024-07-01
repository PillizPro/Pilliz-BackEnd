import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { FollowService } from './follow.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateFollowDto } from './dto/create-follow.dto'
import { DeleteFollowDto } from './dto/delete-follow.dto'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('followUser')
  async followUser(
    @Body() createFollowDto: CreateFollowDto,
    @CurrentUserId() followerId: string
  ) {
    return await this.followService.createFollowers(createFollowDto, followerId)
  }

  @Post('unfollowUser')
  async unfollowUser(
    @Body() deleteFollowDto: DeleteFollowDto,
    @CurrentUserId() followerId: string
  ) {
    return await this.followService.deleteFollowers(deleteFollowDto, followerId)
  }

  @Get('userNbFollowers')
  async getUserNbFollowers(@CurrentUserId() userId: string) {
    return await this.followService.getNbFollowers(userId)
  }

  @Get('userNbFollowing')
  async getUserNbFollowing(@CurrentUserId() userId: string) {
    return await this.followService.getNbFollowing(userId)
  }

  @Get('userFollowers')
  async getUserFollowers(@CurrentUserId() userId: string) {
    return await this.followService.getFollowers(userId)
  }

  @Get('isUserFollowedBy/:followingUid')
  async isUserFollowedBy(
    @Param('followingUid', new ParseUUIDPipe()) followingUid: string,
    @CurrentUserId() followerUid: string
  ) {
    return await this.followService.isUserFollowBy(followerUid, followingUid)
  }
}
