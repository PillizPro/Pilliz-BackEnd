import { Injectable } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FindChatDto } from './dto/find-chat-dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { GetConversationsDto } from './dto/get-conversations.dto'

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async updateOneMessageStatus(messageId: string, messageStatus: number) {
    //0 corresponds to a not-sent message
    //1 corresponds to a not-viewed message
    //2 corresponds to a viewed message
    await this.prismaService.message.update({
      where: {
        id: messageId,
      },
      data: { status: messageStatus },
    })
  }

  async updateAllMessagesStatus(
    message: { conversationId: string | undefined; userId: string },
    messagesStatus: number
  ) {
    //0 corresponds to a not-sent message
    //1 corresponds to a not-viewed message
    //2 corresponds to a viewed message
    let statusArray: number[] = []
    if (messagesStatus === 0) statusArray = [1, 2]
    if (messagesStatus === 1) statusArray = [0, 2]
    if (messagesStatus === 2) statusArray = [0]
    await this.prismaService.message.updateMany({
      where: {
        AND: [
          { conversationId: message.conversationId },
          { receiverId: message.userId },
          { status: { notIn: statusArray } },
        ],
      },
      data: { status: messagesStatus },
    })
  }

  async createChat(createChatDto: CreateChatDto) {
    try {
      const { conversationId, authorId, content, type } = createChatDto

      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: conversationId },
        include: {
          Users: true,
        },
      })
      if (!conversation?.Users)
        throw new Error('There is no Users in this conversation')
      let receiverId: string = ''
      let authorName: string = ''
      for (const user of conversation.Users) {
        if (user.id !== authorId) {
          receiverId = user.id
        } else {
          authorName = user.name
        }
      }
      const newMessage = await this.prismaService.message.create({
        data: {
          authorId,
          content,
          conversationId,
          receiverId,
          type,
        },
      })
      this.updateOneMessageStatus(newMessage.id, 1)
      return {
        receiverId,
        chat: {
          idMessage: newMessage.id,
          text: content,
          name: authorName,
          messageType: type,
          messageStatus: newMessage.status,
        },
      }
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
      this.updateAllMessagesStatus(
        { conversationId: conversation_?.id, userId: findChatDto.userId },
        2
      )
      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: conversation_?.id },
        include: {
          Messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      })
      if (conversation?.Messages) {
        const messages = await Promise.all(
          conversation.Messages.map(async (message) => {
            const user = await this.prismaService.users.findUnique({
              where: { id: message.authorId },
            })
            return {
              idMessage: message.id,
              text: message.content,
              name: user?.name,
              messageType: message.type,
              messageStatus: message.status,
              isSender: message.authorId === findChatDto.userId,
            }
          })
        )
        return messages
      }
      return
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
