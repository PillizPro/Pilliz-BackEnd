import { Injectable } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FindChatDto } from './dto/find-chat.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { GetConversationsDto } from './dto/get-conversations.dto'
import { FindAllUsersConvDto } from './dto/find-users-conv.dto'

enum MessageStatus {
  READ,
  DELIVERED,
  UNELIVERED,
  PENDING,
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async updateOneMessageStatus(
    messageId: string,
    messageStatus: MessageStatus
  ) {
    try {
      return await this.prismaService.message.update({
        where: {
          id: messageId,
        },
        data: { status: messageStatus },
      })
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when updating a message status')
    }
  }

  async updateAllMessagesStatus(
    message: { conversationId: string | undefined; userId: string },
    messagesStatus: MessageStatus
  ) {
    try {
      let statusArray: number[] = []
      if (messagesStatus === MessageStatus.UNELIVERED)
        statusArray = [MessageStatus.DELIVERED, MessageStatus.READ]
      if (messagesStatus === MessageStatus.DELIVERED)
        statusArray = [MessageStatus.UNELIVERED, MessageStatus.READ]
      if (messagesStatus === MessageStatus.READ)
        statusArray = [MessageStatus.UNELIVERED]
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
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when updating multiple messages status')
    }
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
      const updatedMessage = await this.updateOneMessageStatus(newMessage.id, 1)
      return {
        receiverId,
        chat: {
          idMessage: updatedMessage.id,
          text: content,
          name: authorName,
          messageType: type,
          messageStatus: updatedMessage.status,
        },
      }
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when sending a message')
    }
  }

  async emitEventCreateChat(createChatDto: CreateChatDto, receiverId: string) {
    const { authorId, content } = createChatDto
    try {
      this.eventEmitter.emit('notifyUser', 0, authorId, content, receiverId)
    } catch (err) {
      console.error(err)
      throw new Error(
        'An error occured when emitting an event for creating chat'
      )
    }
  }

  async findAllUsersConv(findAllUsersConv: FindAllUsersConvDto) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: { id: findAllUsersConv.conversationId },
      include: {
        Users: true,
      },
    })
    if (!conversation?.Users) return
    const users = conversation.Users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        profilePhoto: user.profilPicture,
      }
    })
    function customSort(a: any, b: any): number {
      if (a === findAllUsersConv.userId && b !== findAllUsersConv.userId) {
        return -1
      } else if (
        a !== findAllUsersConv.userId &&
        b === findAllUsersConv.userId
      ) {
        return 1
      } else {
        return 0
      }
    }

    users.sort(customSort)
    return users
  }

  async findAllChat(findChatDto: FindChatDto) {
    try {
      const conversation_ = await this._getOrCreateConversation(findChatDto)
      await this.updateAllMessagesStatus(
        { conversationId: conversation_?.id, userId: findChatDto.userId },
        MessageStatus.READ
      )
      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: conversation_?.id },
        include: {
          Messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              MessageReactions: true,
            },
          },
        },
      })
      if (conversation?.Messages) {
        const messages = conversation.Messages.map((message) => {
          const reactions = message.MessageReactions.map(
            (reaction) => reaction.reaction
          )
          const userThatReacts = message.MessageReactions.map(
            (reaction) => reaction.userIdReaction
          )
          return {
            conversationId: conversation.id,
            id: message.id,
            message: message.content,
            createdAt: new Date(message.createdAt).toISOString(),
            message_type: message.type,
            status: message.status,
            sendBy: message.authorId,
            reaction: {
              reactions: reactions,
              reactedUserIds: userThatReacts,
            },
            reply_message: {},
          }
        })
        return messages
      }
      return { conversationId: conversation?.id }
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
                Users: { some: { id: findChatDto.receiverId } },
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
        let receiverId: string = ''
        let name: string = ''
        let profilPicture: string = ''
        let isActive: boolean = false
        for (const user of conv.Users) {
          if (user.id !== getConversationsDto.userId) {
            receiverId = user.id
            name = user.name
            profilPicture = user.profilPicture
            isActive = user.isConnected
            break
          }
        }
        let lastMessage: string | undefined = ''
        let messageType: number = 0
        if (conv.Messages[0]) {
          lastMessage = conv.Messages[0].content
          messageType = conv.Messages[0].type
        }
        const conversationId = conv.id
        return {
          conversationId,
          receiverId,
          name,
          isActive,
          image: profilPicture,
          time: 'null',
          lastMessage,
          messageType,
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
