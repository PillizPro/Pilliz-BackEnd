import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { ChatService } from './chat.service'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { FindChatDto } from './dto/find-chat-dto'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import { Socket } from 'socket.io'

@UsePipes(new ValidationPipe({ whitelist: true }))
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private _connectedUsers: Map<string, Socket> = new Map()

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
    client.on('authChat', (payload: { userId: string }) => {
      this._connectedUsers.set(payload.userId, client)
      console.log(this._connectedUsers)
      this.chatService.changeConnectedStatus(payload.userId, true)
    })
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
    for (const [userId, socket] of this._connectedUsers.entries()) {
      if (socket === client) {
        this._connectedUsers.delete(userId)
        this.chatService.changeConnectedStatus(userId, false)
        break
      }
    }
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    const receiverSocket = this._connectedUsers.get(createChatDto.receiverId)
    if (receiverSocket) {
      const newChatEntity = this.chatService.create(createChatDto, true)
      receiverSocket.emit('privateChat', {
        author: createChatDto.authorId,
        content: createChatDto.content,
      })
      return newChatEntity
    } else {
      this.chatService.create(createChatDto, false)
      console.log('The receiver is not connected')
    }
  }

  @SubscribeMessage('findAllChat')
  findAll(@MessageBody() findChatDto: FindChatDto) {
    return this.chatService.findAll(findChatDto)
  }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   // TO DO
  //   return this.chatService.update(updateChatDto.id, updateChatDto)
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   // TO DO
  //   return this.chatService.remove(id)
  // }
}
