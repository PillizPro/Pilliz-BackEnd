import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { WSGateway } from './websocket.gateway'
import { UserModule } from 'src/user/user.module'
import { ChatController } from './chat.controller'

@Module({
  imports: [UserModule],
  controllers: [ChatController],
  providers: [WSGateway, ChatService],
})
export class WSModule {}
