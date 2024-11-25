import { Controller } from '@nestjs/common'
import { Body, Get, Param, Post } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'
import { SignalementDto } from './dto/signalement.dto'
import { SignalementService } from './signalement.service'

@Controller('signalement')
export class SignalementController {
  constructor(private readonly signalementService: SignalementService) {}

  @ApiBearerAuth()
  @Get('getAllsignalements')
  async getAllsignalements() {
    return await this.signalementService.getAllSignalement()
  }

  @ApiBearerAuth()
  @Get('getAllUserSignalements/:id')
  async getAllUserSignalements(@Param('id') id: string) {
    return await this.signalementService.getAllUserSignalement(id)
  }

  @ApiBearerAuth()
  @Post('createsignalement')
  async createsignalement(
  @CurrentUserId() userId: string,
  @Body() createsignalement: SignalementDto
  ) {
    return await this.signalementService.createSignalement(createsignalement, userId)
  }

  @ApiBearerAuth()
  @Post('changesignalementStatus/:signalementId')
  async changesignalementStatus(@Param('signalementId') signalementId: string) {
    return await this.signalementService.changeSignalementStatus(signalementId)
  }
}
