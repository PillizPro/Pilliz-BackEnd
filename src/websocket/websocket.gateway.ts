import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets'
import { ChatService } from './chat.service'
import {
  CreateChatDto,
  FindChatDto,
  GetConversationsDto,
  FindAllUsersConvDto,
  DeleteConvDto,
  CreateReactionDto,
  DeleteChatDto,
  AcceptConvDto,
  MessageStatusDto,
} from './dto'
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { UserService } from 'src/user/user.service'
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
  @WebSocketServer()
  server: Server

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async handleConnection(client: Socket) {
    client.on('authWS', async (payload: { userId: string }) => {
      try {
        this.userService.updateConnectedStatus(payload.userId, true)
        await this.addWSSocketId(payload.userId, client.id)
        console.log(`User: ${payload.userId} | Client connected: ${client.id}`)
      } catch (err) {
        client.disconnect()
        console.error('handleConnection:', err)
      }
    })
  }

  async handleDisconnect(client: Socket) {
    const userId = await this.removeWSUserId(client.id)
    try {
      if (userId) this.userService.updateConnectedStatus(userId, false)
    } catch (err) {
      console.error('handleDisconnect:', err)
    }
    console.log(`User: ${userId} | Client disconnected: ${client.id}`)
  }

  // add socketId with userId in cache
  async addWSSocketId(userId: string, socketId: string): Promise<void> {
    const socketIds = await this.getWSSocketId(userId)

    if (socketIds && Array.isArray(socketIds) && socketIds.length) {
      socketIds.push(socketId)
      await this.cacheManager.set(`WSuserId:${userId}`, [...new Set(socketIds)])
    } else {
      await this.cacheManager.set(`WSuserId:${userId}`, [socketId])
    }
    await this.cacheManager.set(`WSsocketId:${socketId}`, userId)
  }

  // get socketId using userId
  async getWSSocketId(userId: string): Promise<string[] | null | undefined> {
    return this.cacheManager.get(`WSuserId:${userId}`)
  }

  // get userId using socketId
  async getWSUserId(socketId: string): Promise<string | null | undefined> {
    return this.cacheManager.get(`WSsocketId:${socketId}`)
  }

  // Remove socketId from user array OR
  // No active connection then remove userId from cache
  async removeWSUserId(socketId: string): Promise<string | null | undefined> {
    const userId = await this.getWSUserId(socketId)
    const socketIds = userId ? await this.getWSSocketId(userId) : null

    if (socketIds) {
      const updatedSocketIds = socketIds.filter((id) => id !== socketId)

      if (updatedSocketIds.length > 0) {
        await this.cacheManager.set(`WSuserId:${userId}`, updatedSocketIds)
      } else {
        await this.cacheManager.del(`WSuserId:${userId}`)
      }
    }
    await this.cacheManager.del(`WSsocketId:${socketId}`)

    return userId
  }

  @SubscribeMessage('createChat')
  async createChat(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket
  ) {
    const newChatEntity = await this.chatService.createChat(createChatDto)
    const receiverSocketId = await this.getWSSocketId(newChatEntity.receiverId)
    client.emit('newChat', newChatEntity.chat)
    if (receiverSocketId) {
      receiverSocketId.forEach((id) => {
        this.server.to(id).emit('newChat', newChatEntity.chat)
      })
      const conversations = await this.chatService.getConversations({
        userId: newChatEntity.receiverId,
      })
      receiverSocketId.forEach((id) => {
        this.server.to(id).emit('getConversations', conversations)
      })
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
    const receiverSocketId = await this.getWSSocketId(newReaction.receiverId)
    client.emit('newReaction', newReaction.chat)
    if (receiverSocketId)
      receiverSocketId.forEach((id) => {
        this.server.to(id).emit('newReaction', newReaction.chat)
      })
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
    const receiverSocketId = await this.getWSSocketId(deleteChat.receiverId)
    client.emit('deleteChat', deleteChat.chat)
    if (receiverSocketId) {
      receiverSocketId.forEach((id) => {
        this.server.to(id).emit('deleteChat', deleteChat.chat)
      })
      const conversations = await this.chatService.getConversations({
        userId: deleteChat.receiverId,
      })
      receiverSocketId.forEach((id) => {
        this.server.to(id).emit('getConversations', conversations)
      })
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
