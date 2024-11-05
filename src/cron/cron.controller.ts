import { Controller, Get } from '@nestjs/common'
import { CronService } from './cron.service'

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Get()
  create() {
    return this.cronService.cron()
  }

  @Get('getLastFourWeeks')
  MetricsLastFourWeeks() {
    return this.cronService.MetricsLastFourWeeks()
  }

  @Get('getAllMetrics')
  getAllMetrics() {
    return this.cronService.getAllMetrics()
  }
}
