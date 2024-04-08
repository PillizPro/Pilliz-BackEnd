import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { BlockUserDto } from './dto/block-user.dto'
import { UnblockUserDto } from './dto/unblock-user.dto'
import { HideUserDto } from './dto/hide-user.dto'
import { UnhideUserDto } from './dto/unhide-user.dto'
import { HideWordDto } from './dto/hide-word.dto'
import { UnhideWordDto } from './dto/unhide-word.dto'

import { BlockingService } from './blocking.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Blocking')
@Controller('block')
export class BlockingController {
  constructor(private readonly blockingService: BlockingService) {}

  @Post('blockUser')
  async blockUser(@Body() blockUserDto: BlockUserDto) {
    return await this.blockingService.blockUser(blockUserDto)
  }

  @Post('unblockUser')
  async unblockUser(@Body() unblockUserDto: UnblockUserDto) {
    return await this.blockingService.unblockUser(unblockUserDto)
  }

  @Post('hideUser')
  async hideUser(@Body() hideUserDto: HideUserDto) {
    return await this.blockingService.hideUser(hideUserDto)
  }

  @Post('unhideUser')
  async unhideUser(@Body() unhideUserDto: UnhideUserDto) {
    return await this.blockingService.unhideUser(unhideUserDto)
  }

  @Post('hideWord')
  async hideWord(@Body() hideWordDto: HideWordDto) {
    return await this.blockingService.hideWord(hideWordDto)
  }

  @Post('unhideWord')
  async unhideWord(@Body() unhideWordDto: UnhideWordDto) {
    return await this.blockingService.unhideWord(unhideWordDto)
  }

  @Get('numberUsersBlocked/:id')
  async findUsersBlocked(@Param('id') userId: string) {
    return await this.blockingService.findUsersBlocked(userId)
  }

  @Get('numberUsersHided/:id')
  async findUsersHided(@Param('id') userId: string) {
    return await this.blockingService.findUsersHided(userId)
  }

  @Get('numberWordsHided/:id')
  async findWordsHided(@Param('id') userId: string) {
    return await this.blockingService.findWordsHided(userId)
  }

  @Get('detailsUsersBlockedList/:id')
  async findUsersDetailsBlocked(@Param('id') userId: string) {
    return await this.blockingService.findUsersDetailsBlocked(userId)
  }

  @Get('detailsUsersHidedList/:id')
  async findUsersDetailsHided(@Param('id') userId: string) {
    return await this.blockingService.findUsersDetailsHided(userId)
  }
}
