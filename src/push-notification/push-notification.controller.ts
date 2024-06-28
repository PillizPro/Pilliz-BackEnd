import { Controller, Get } from '@nestjs/common'
import { PushNotificationService } from './push-notification.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUserId } from 'src/common/decorators'

@ApiTags('PushNotification')
@Controller('pushNotification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService
  ) {}

  @Get('allNotifications')
  async getAllNotifications(@CurrentUserId() userId: string) {
    return await this.pushNotificationService.getAllNotifications(userId)
  }
}
