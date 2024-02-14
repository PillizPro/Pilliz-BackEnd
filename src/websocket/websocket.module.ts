import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { WSGateway } from './websocket.gateway'
import { UserModule } from 'src/user/user.module'
import { NotificationService } from './notification.service'

@Module({
  imports: [UserModule],
  providers: [WSGateway, ChatService, NotificationService],
})
export class WSModule {}
