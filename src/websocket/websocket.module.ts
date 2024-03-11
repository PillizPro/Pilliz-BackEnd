import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { WSGateway } from './websocket.gateway'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [UserModule],
  providers: [WSGateway, ChatService],
})
export class WSModule {}
