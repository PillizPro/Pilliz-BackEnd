import { Module } from '@nestjs/common'
import { SignalementController } from './signalement.controller'
import { SignalementService } from './signalement.service'

@Module({
  controllers: [SignalementController],
  providers: [SignalementService],
})
export class SignalementModule {}
