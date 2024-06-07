import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets'
import { ChatService } from './chat.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { FindChatDto } from './dto/find-chat.dto'
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { UserService } from 'src/user/user.service'
import { GetConversationsDto } from './dto/get-conversations.dto'
import { MessageStatusDto } from './dto/message-status.dto'
import { FindAllUsersConvDto } from './dto/find-users-conv.dto'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { DeleteConvDto } from './dto/delete-conv.dto'
import { DeleteChatDto } from './dto/delete-chat.dto'
import { AcceptConvDto } from './dto/accept-conv.dto'
import { WsExceptionFilter } from 'src/exceptions/ws-exception/ws-exception.filter'

@UsePipes(new ValidationPipe({ whitelist: true }))
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WSGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private _connectedUsers: Map<string, Socket> = new Map()

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    // server.use((socket: Socket, next) => {
    //   socket.handshake.headers.authorization
    //   const [type, token] =
    //     socket.handshake.headers.authorization?.split(' ') ?? []
    //   const bearerToken = type === 'Bearer' ? token : undefined
    //   if (bearerToken) {
    //     // handle token validation
    //     next()
    //   } else {
    //     next(new Error('Empty Token!'))
    //   }
    // })
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
    client.on('authWS', (payload: { userId: string }) => {
      try {
        this.userService.updateConnectedStatus(payload.userId, true)
        this._connectedUsers.set(payload.userId, client)
        console.log(this._connectedUsers)
      } catch (err) {
        client.disconnect()
        console.error(err)
      }
    })
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
    for (const [userId, socket] of this._connectedUsers.entries()) {
      if (socket === client) {
        this._connectedUsers.delete(userId)
        this.userService.updateConnectedStatus(userId, false)
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
    client.emit('newChat', newChatEntity.chat)
    if (receiverSocket) {
      receiverSocket.emit('newChat', newChatEntity.chat)
      const conversations = await this.chatService.getConversations({
        userId: newChatEntity.receiverId,
      })
      receiverSocket.emit('getConversations', conversations)
    } else {
      this.chatService.emitEventCreateChat(
        createChatDto,
        newChatEntity.receiverId
      )
      console.log('The receiver is not connected')
    }
    return newChatEntity.chat
  }

  @SubscribeMessage('createReaction')
  async createReaction(
    @MessageBody() createReactionDto: CreateReactionDto,
    @ConnectedSocket() client: Socket
  ) {
    const newReaction = await this.chatService.createReaction(createReactionDto)
    const receiverSocket = this._connectedUsers.get(newReaction.receiverId)
    client.emit('newReaction', newReaction.chat)
    if (receiverSocket) receiverSocket.emit('newReaction', newReaction.chat)
    return newReaction.chat
  }

  @SubscribeMessage('viewMessage')
  async viewMessage(
    @MessageBody() messageStatusDto: MessageStatusDto,
    @ConnectedSocket() client: Socket
  ) {
    // Remplacer le 2 par un membre de l'enum MessageStatus quand l'enum
    // sera dans le dossier utils pour les types-interfaces
    this.chatService.updateOneMessageStatus(messageStatusDto.idMessage, 2)
    client.emit('viewMessage')
  }

  @SubscribeMessage('findAllUsersConv')
  async findAllUsersConv(
    @MessageBody() findAllUsersConvDto: FindAllUsersConvDto,
    @ConnectedSocket() client: Socket
  ) {
    const allUsersConv =
      await this.chatService.findAllUsersConv(findAllUsersConvDto)
    client.emit('allUsersConv', allUsersConv)
    return allUsersConv
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

  @SubscribeMessage('deleteChat')
  async deleteChat(
    @MessageBody() deleteChatDto: DeleteChatDto,
    @ConnectedSocket() client: Socket
  ) {
    const deleteChat = await this.chatService.deleteChat(deleteChatDto)
    const receiverSocket = this._connectedUsers.get(deleteChat.receiverId)
    client.emit('deleteChat', deleteChat.chat)
    if (receiverSocket) {
      receiverSocket.emit('deleteChat', deleteChat.chat)
      const conversations = await this.chatService.getConversations({
        userId: deleteChat.receiverId,
      })
      receiverSocket.emit('getConversations', conversations)
    }
    return deleteChat.chat
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

  @SubscribeMessage('deleteConversations')
  async deleteConversations(
    @MessageBody() deleteConvDto: DeleteConvDto,
    @ConnectedSocket() client: Socket
  ) {
    await this.chatService.deleteConversations(deleteConvDto)
    const conversations = await this.chatService.getConversations({
      userId: deleteConvDto.userId,
    })
    client.emit('getConversations', conversations)
    return conversations
  }

  @SubscribeMessage('acceptConversation')
  async acceptConversation(
    @MessageBody() acceptConversationDto: AcceptConvDto
  ) {
    await this.chatService.acceptConversation(acceptConversationDto)
  }
}
