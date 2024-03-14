import { Controller, Get, Param } from '@nestjs/common'
import { PushNotificationService } from './push-notification.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('PushNotification')
@Controller('pushNotification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService
  ) {}

  @Get('allNotifications/:userId')
  async getAllNotifications(@Param('userId') userId: string) {
    return await this.pushNotificationService.getAllNotifications(userId)
  }
}
