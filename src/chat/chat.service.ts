import { Injectable } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FindChatDto } from './dto/find-chat-dto'
import { ChatEntity } from './entities/chat.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { GetConversationsDto } from './dto/get-conversations.dto'

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
      const conversation_ = await this._getOrCreateConversation(findChatDto)
      await this.prismaService.message.updateMany({
        where: { conversationId: conversation_?.id },
        data: { read: true },
      })
      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: conversation_?.id },
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

  async _getOrCreateConversation(findChatDto: FindChatDto) {
    try {
      const existingConversation =
        await this.prismaService.conversation.findFirst({
          where: {
            AND: [
              { Users: { some: { id: findChatDto.userId } } },
              {
                Users: { some: { id: findChatDto?.receiverId } },
              },
            ],
          },
        })
      if (!findChatDto.conversationId && !existingConversation) {
        const newConversation = await this.prismaService.conversation.create({
          data: {
            Users: {
              connect: [
                { id: findChatDto.userId },
                { id: findChatDto.receiverId },
              ],
            },
          },
        })
        return newConversation
      } else if (findChatDto.conversationId) {
        const conversation = await this.prismaService.conversation.findUnique({
          where: { id: findChatDto.conversationId },
        })
        return conversation
      } else {
        const conversation = await this.prismaService.conversation.findUnique({
          where: { id: existingConversation?.id },
        })
        return conversation
      }
    } catch (err) {
      console.error(err)
      throw new Error(
        'An error occured when getting or creating a conversation'
      )
    }
  }

  async getConversations(getConversationsDto: GetConversationsDto) {
    try {
      const conversations = await this.prismaService.conversation.findMany({
        where: {
          Users: {
            some: {
              id: getConversationsDto.userId,
            },
          },
        },
        include: {
          Users: true,
          Messages: { orderBy: { createdAt: 'desc' } },
        },
      })
      const transformedConversations = conversations.map((conv) => {
        let name: string = ''
        let isActive: boolean = false
        for (const user of conv.Users) {
          if (user.id !== getConversationsDto.userId) {
            name = user.name
            isActive = user.isConnected
            break
          }
        }
        let lastMessage: string | undefined = ''
        if (conv.Messages.length !== 0) lastMessage = conv.Messages[0]?.content
        const conversationId = conv.id
        return {
          conversationId,
          name,
          isActive,
          image: 'null',
          time: 'null',
          lastMessage,
        }
      })
      return transformedConversations
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when getting conversations')
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
