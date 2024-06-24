import { Controller } from '@nestjs/common'
import { Body, Get, Param, Post } from '@nestjs/common'
import { SignalementDto } from './dto/signalement.dto'
import { SignalementService } from './signalement.service'

@Controller('signalement')
export class SignalementController {
  constructor(private readonly signalementService: SignalementService) {}

  @Get('getAllsignalements')
  async getAllsignalements() {
    return await this.signalementService.getAllSignalement()
  }

  @Post('createsignalement')
  async createsignalement(@Body() createsignalement: SignalementDto) {
    return await this.signalementService.createSignalement(createsignalement)
  }

  @Post('changesignalementStatus/:signalementId')
  async changesignalementStatus(@Param('signalementId') signalementId: string) {
    return await this.signalementService.changeSignalementStatus(signalementId)
  }
}
