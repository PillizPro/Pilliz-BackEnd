import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { BlockUserDto } from './dto/block-user.dto'
import { UnblockUserDto } from './dto/unblock-user.dto'
import { HideUserDto } from './dto/hide-user.dto'
import { UnhideUserDto } from './dto/unhide-user.dto'
import { BlockingService } from './blocking.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('Blocking')
@Controller('block')
export class BlockingController {
  constructor(private readonly blockingService: BlockingService) {}

  @Post('blockUser')
  async blockUser(
    @Body() blockUserDto: BlockUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.blockingService.blockUser(blockUserDto, userId)
  }

  @Post('unblockUser')
  async unblockUser(
    @Body() unblockUserDto: UnblockUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.blockingService.unblockUser(unblockUserDto, userId)
  }

  @Post('hideUser')
  async hideUser(
    @Body() hideUserDto: HideUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.blockingService.hideUser(hideUserDto, userId)
  }

  @Post('unhideUser')
  async unhideUser(
    @Body() unhideUserDto: UnhideUserDto,
    @CurrentUserId() userId: string
  ) {
    return await this.blockingService.unhideUser(unhideUserDto, userId)
  }

  @Get('hideWord/:wordToHide')
  async hideWord(@Param() wordToHide: string, @CurrentUserId() userId: string) {
    return await this.blockingService.hideWord(wordToHide, userId)
  }

  @Get('unhideWord/:wordToUnhide')
  async unhideWord(
    @Param() wordToUnhide: string,
    @CurrentUserId() userId: string
  ) {
    return await this.blockingService.unhideWord(wordToUnhide, userId)
  }

  @Get('numberUsersBlocked')
  async findUsersBlocked(@CurrentUserId() userId: string) {
    return await this.blockingService.findUsersBlocked(userId)
  }

  @Get('numberUsersHided')
  async findUsersHided(@CurrentUserId() userId: string) {
    return await this.blockingService.findUsersHided(userId)
  }

  @Get('numberWordsHided')
  async findWordsHided(@CurrentUserId() userId: string) {
    return await this.blockingService.findWordsHided(userId)
  }

  @Get('detailsUsersBlockedList')
  async findUsersDetailsBlocked(@CurrentUserId() userId: string) {
    return await this.blockingService.findUsersDetailsBlocked(userId)
  }

  @Get('detailsUsersHidedList')
  async findUsersDetailsHided(@CurrentUserId() userId: string) {
    return await this.blockingService.findUsersDetailsHided(userId)
  }
}
