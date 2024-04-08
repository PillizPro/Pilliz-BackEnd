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

  // @Get('usersBlocked:id')
  // async findCommentsOnPost(@Param('id') usersBlocked: string) {
  //   return await this.blockingService.findCommentsOnPost(postId)
  // }

  // @Get('usersHided:id')
  // async findCommentsOnPost(@Param('id') postId: string) {
  //   return await this.blockingService.findCommentsOnPost(postId)
  // }

  // @Get('wordsHided:id')
  // async findCommentsOnPost(@Param('id') postId: string) {
  //   return await this.blockingService.findCommentsOnPost(postId)
  // }
}
