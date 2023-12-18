import { Controller } from '@nestjs/common'
import { PushNotificationService } from './push-notification.service'

@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService
  ) {}
}
