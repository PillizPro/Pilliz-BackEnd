import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { CronService } from './cron.service'
import { CronController } from './cron.controller'

@Module({
  controllers: [CronController],
  providers: [CronService],
  imports: [ScheduleModule.forRoot()],
})
export class CronModule {}
