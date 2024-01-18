import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets'
import { ChatService } from './chat.service'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { FindChatDto } from './dto/find-chat-dto'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import { Socket } from 'socket.io'
import { UserService } from 'src/user/user.service'
import { GetConversationsDto } from './dto/get-conversations.dto'

@UsePipes(new ValidationPipe({ whitelist: true }))
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private _connectedUsers: Map<string, Socket> = new Map()

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
    client.on('authChat', (payload: { userId: string }) => {
      this._connectedUsers.set(payload.userId, client)
      console.log(this._connectedUsers)
      this.userService.changeConnectedStatus(payload.userId, true)
    })
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
    for (const [userId, socket] of this._connectedUsers.entries()) {
      if (socket === client) {
        this._connectedUsers.delete(userId)
        this.userService.changeConnectedStatus(userId, false)
        break
      }
    }
  }

  @SubscribeMessage('createChat')
  async createChat(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket
  ) {
    const newChatEntity = await this.chatService.createChat(createChatDto)
    const receiverSocket = this._connectedUsers.get(newChatEntity.receiverId)
    client.emit('newChat', {
      ...newChatEntity.chat,
      isSender: true,
    })
    if (receiverSocket) {
      receiverSocket.emit('newChat', {
        ...newChatEntity.chat,
        isSender: false,
      })
      return {
        ...newChatEntity.chat,
        isSender: false,
      }
    } else {
      this.chatService.emitEventCreateChat(createChatDto)
      console.log('The receiver is not connected')
    }
  }

  @SubscribeMessage('findAllChat')
  async findAllChat(
    @MessageBody() findChatDto: FindChatDto,
    @ConnectedSocket() client: Socket
  ) {
    const allChat = await this.chatService.findAllChat(findChatDto)
    client.emit('allChat', allChat)
    return allChat
  }

  @SubscribeMessage('getConversations')
  async getConversations(
    @MessageBody() getConversationsDto: GetConversationsDto,
    @ConnectedSocket() client: Socket
  ) {
    const conversations =
      await this.chatService.getConversations(getConversationsDto)
    client.emit('getConversations', conversations)
    return conversations
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
