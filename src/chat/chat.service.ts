import { Injectable } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FindChatDto } from './dto/find-chat-dto'
import { ChatEntity } from './entities/chat.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CreateConversationDto } from './dto/create-conversation-dto'

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    try {
      const { conversationId, authorId, content } = createChatDto
      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: conversationId },
        include: {
          Users: true,
        },
      })
      if (!conversation?.Users)
        throw new Error('There is no Users in this conversation')
      let receiverId: string = ''
      for (const user of conversation.Users) {
        if (user.id !== authorId) {
          receiverId = user.id
          break
        }
      }
      const newMessage = await this.prismaService.message.create({
        data: {
          authorId,
          content,
          conversationId,
          receiverId,
        },
      })
      return { receiverId, chat: new ChatEntity(newMessage) }
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when sending a message')
    }
  }

  async emitEventCreateChat(createChatDto: CreateChatDto) {
    const { authorId, content } = createChatDto
    const user = await this.prismaService.users.findUnique({
      where: { id: authorId },
    })
    const userName = user?.name
    this.eventEmitter.emit('createChat', { userName, content })
  }

  async findAllChat(findChatDto: FindChatDto) {
    try {
      await this.prismaService.message.updateMany({
        where: { conversationId: findChatDto.conversationId },
        data: { read: true },
      })
      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: findChatDto.conversationId },
        include: {
          Messages: true,
        },
      })
      const messages = conversation?.Messages.map(
        (message) => new ChatEntity(message)
      )
      return messages
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when getting the last messages')
    }
  }

  async getConversations(userId: string) {
    try {
      const conversations = await this.prismaService.conversation.findMany({
        where: {
          Users: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          Users: true,
        },
      })
      let receiverId: string = ''
      let receiverName: string = ''
      const transformedConversations = conversations.map((conv) => {
        for (const user of conv.Users) {
          if (user.id !== userId) {
            receiverId = user.id
            receiverName = user.name
            break
          }
        }
        const conversationId = conv.id
        return { conversationId, receiverId, receiverName }
      })
      return transformedConversations
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when getting conversations')
    }
  }

  async createConversation(createConversationDto: CreateConversationDto) {
    try {
      // const newConversation = await this.prismaService.conversation.create({
      //   data: {
      //     Users: {
      //       connectOrCreate: {
      //         where: {
      //           OR: {
      //           }
      //           id: createConversationDto.userId
      //         },
      //       },
      //     },
      //   },
      // })
      // return newConversation
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when creating a conversation')
    }
  }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   // TO DO
  //   return `This action updates a #${id} chat`
  // }

  // remove(id: number) {
  //   // TO DO
  //   return `This action removes a #${id} chat`
  // }
}
