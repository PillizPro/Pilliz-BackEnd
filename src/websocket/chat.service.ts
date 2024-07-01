import { Injectable } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FindChatDto } from './dto/find-chat.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { GetConversationsDto } from './dto/get-conversations.dto'
import { FindAllUsersConvDto } from './dto/find-users-conv.dto'
import { DeleteConvDto } from './dto/delete-conv.dto'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { Message, MessageReactions } from '@prisma/client'
import { DeleteChatDto } from './dto/delete-chat.dto'
import { AcceptConvDto } from './dto/accept-conv.dto'

enum MessageStatus {
  READ,
  DELIVERED,
  UNDELIVERED,
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
      if (messagesStatus === MessageStatus.UNDELIVERED)
        statusArray = [MessageStatus.DELIVERED, MessageStatus.READ]
      if (messagesStatus === MessageStatus.DELIVERED)
        statusArray = [MessageStatus.UNDELIVERED, MessageStatus.READ]
      if (messagesStatus === MessageStatus.READ)
        statusArray = [MessageStatus.UNDELIVERED]
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
      for (const user of conversation.Users) {
        if (user.id !== authorId) receiverId = user.id
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
      const updatedMessage = await this.updateOneMessageStatus(
        newMessage.id,
        MessageStatus.DELIVERED
      )
      await this.prismaService.conversation.update({
        where: { id: conversation.id },
        data: {
          UsersThatDeleteConv: {
            disconnect: {
              id: receiverId,
            },
          },
        },
      })
      return {
        receiverId,
        chat: {
          id: updatedMessage.id,
          message: content,
          createdAt: updatedMessage.createdAt,
          message_type: type,
          sendBy: authorId,
          status: updatedMessage.status,
          reaction: null,
          reply_message: null,
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

  async createReaction(createReactionDto: CreateReactionDto) {
    try {
      const { authorId, reactions, messageId } = createReactionDto
      if (reactions.length === 0)
        return await this._deleteReaction(createReactionDto)
      const chat = await this.prismaService.message.update({
        where: { id: messageId },
        data: {
          MessageReactions: {
            upsert: {
              create: {
                reaction: reactions[0],
                userIdReaction: authorId,
              },
              update: {
                reaction: reactions[0],
                userIdReaction: authorId,
              },
              where: {
                msgUserReactId: {
                  messageId: messageId,
                  userIdReaction: authorId,
                },
              },
            },
          },
        },
        include: {
          MessageReactions: true,
        },
      })
      if (!chat) throw new Error('An error occured when getting the message')
      return await this._returnReactedMessage(
        authorId,
        chat,
        chat.MessageReactions
      )
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when sending a reaction')
    }
  }

  async _deleteReaction(createReactionDto: CreateReactionDto) {
    const { authorId, messageId } = createReactionDto

    const chat = await this.prismaService.messageReactions.delete({
      where: {
        msgUserReactId: {
          messageId: messageId,
          userIdReaction: authorId,
        },
      },
      include: {
        Message: {
          include: {
            MessageReactions: true,
          },
        },
      },
    })
    if (!chat)
      throw new Error(
        'An error occured when getting the message reaction to delete it'
      )
    return await this._returnReactedMessage(
      authorId,
      chat.Message,
      chat.Message.MessageReactions
    )
  }

  async _returnReactedMessage(
    authorReactionId: string,
    chat: Message,
    chatReactions: MessageReactions[]
  ) {
    let receiverId: string
    if (chat.authorId === authorReactionId) receiverId = chat.receiverId
    else receiverId = chat.authorId
    const reacts = chatReactions.map((reaction) => reaction.reaction)
    const userThatReacts = chatReactions.map(
      (reaction) => reaction.userIdReaction
    )
    return {
      receiverId,
      chat: {
        id: chat.id,
        message: chat.content,
        createdAt: chat.createdAt,
        message_type: chat.type,
        sendBy: chat.authorId,
        status: chat.status,
        reaction: {
          reactions: reacts,
          reactedUserIds: userThatReacts,
        },
        reply_message: null,
      },
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
    const usersList = conversation.Users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        profilePhoto: user.profilPicture,
      }
    })
    const sortUsersList: object[] = []
    let firstUserInList: object = {}
    for (const user of usersList) {
      if (user.id === findAllUsersConv.userId) {
        firstUserInList = user
      } else {
        sortUsersList.push(user)
      }
    }
    sortUsersList.push(firstUserInList)
    sortUsersList.reverse()
    return sortUsersList
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
            createdAt: message.createdAt,
            message_type: message.type,
            status: message.status,
            sendBy: message.authorId,
            reaction: {
              reactions: reactions,
              reactedUserIds: userThatReacts,
            },
            reply_message: null,
          }
        })
        return messages
      }
      return { conversationId: conversation?.id }
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when getting last messages')
    }
  }

  async deleteChat(deleteChatDto: DeleteChatDto) {
    try {
      const res = await this.prismaService.message.delete({
        where: { id: deleteChatDto.messageId },
      })
      return {
        receiverId: res.receiverId,
        chat: {
          messageId: res.id,
        },
      }
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when deleting a message')
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
        let isInvitation: object
        let isProConv: boolean = false
        const isReceiverFollowUser =
          await this.prismaService.follows.findUnique({
            where: {
              followerId_followingId: {
                followerId: findChatDto.receiverId,
                followingId: findChatDto.userId,
              },
            },
          })
        const receiver = await this.prismaService.users.findUnique({
          where: { id: findChatDto.receiverId },
        })
        if (receiver) isProConv = receiver.isCompanyAccount
        const user = await this.prismaService.users.findUnique({
          where: { id: findChatDto.userId },
        })
        if (user) isProConv = user.isCompanyAccount
        if (!isReceiverFollowUser) {
          isInvitation = {
            Users: {
              connect: [
                { id: findChatDto.userId },
                { id: findChatDto.receiverId },
              ],
            },
            InvitationConversation: {
              create: {
                nonefollowerId: findChatDto.receiverId,
                userId: findChatDto.userId,
                invitation: true,
              },
            },
          }
        } else {
          isInvitation = {
            Users: {
              connect: [
                { id: findChatDto.userId },
                { id: findChatDto.receiverId },
              ],
            },
          }
        }
        const newConversation = await this.prismaService.conversation.create({
          data: { ...isInvitation, isProConv },
        })
        return newConversation
      } else if (findChatDto.conversationId) {
        const conversation = await this.prismaService.conversation.findUnique({
          where: { id: findChatDto.conversationId },
        })
        return conversation
      } else {
        const conversation = await this.prismaService.conversation.update({
          where: { id: existingConversation?.id },
          data: {
            UsersThatDeleteConv: {
              disconnect: {
                id: findChatDto.userId,
              },
            },
          },
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
          AND: [
            {
              Users: {
                some: {
                  id: getConversationsDto.userId,
                },
              },
            },
            {
              UsersThatDeleteConv: {
                none: {
                  id: getConversationsDto.userId,
                },
              },
            },
          ],
        },
        include: {
          Users: true,
          InvitationConversation: true,
          Messages: { orderBy: { createdAt: 'desc' } },
        },
      })
      const transformedConversations = conversations.map((conv) => {
        let receiverId: string = ''
        let name: string = ''
        let profilPicture: string = ''
        let isActive: boolean = false
        const isInvitation: boolean | undefined =
          conv.InvitationConversation?.invitation
        const nonefollowerId: string | undefined =
          conv.InvitationConversation?.nonefollowerId
        const isProConv: boolean = conv.isProConv

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
        let lastMessageCreatedAt = ''
        let messageType: number = 0
        if (conv.Messages[0]) {
          lastMessage = conv.Messages[0].content
          lastMessageCreatedAt = conv.Messages[0].createdAt.toISOString()
          messageType = conv.Messages[0].type
        }
        const conversationId = conv.id
        return {
          conversationId,
          receiverId,
          name,
          isActive,
          image: profilPicture,
          time: lastMessageCreatedAt,
          lastMessage,
          messageType,
          isInvitation,
          isProConv,
          nonefollowerId,
        }
      })
      return transformedConversations
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when getting conversations')
    }
  }

  async deleteConversations(deleteConvDto: DeleteConvDto) {
    try {
      const { conversationsId, invitations } = deleteConvDto
      const maxLengthArrayConv: number =
        conversationsId.length > invitations.length
          ? conversationsId.length
          : invitations.length
      for (let i: number = 0; i < maxLengthArrayConv; i++) {
        await this.prismaService.conversation.update({
          where: { id: conversationsId[i] },
          data: {
            UsersThatDeleteConv: {
              connect: { id: deleteConvDto.userId },
            },
          },
        })
      }
      const convToPotentiallyDelete =
        await this.prismaService.conversation.findMany({
          where: { id: { in: deleteConvDto.conversationsId } },
          include: { Users: true, UsersThatDeleteConv: true },
        })
      const idConvToDelete: string[] = []
      for (const conv of convToPotentiallyDelete) {
        if (conv.Users.length === conv.UsersThatDeleteConv.length)
          idConvToDelete.push(conv.id)
      }
      await this.prismaService.conversation.deleteMany({
        where: {
          id: { in: idConvToDelete },
        },
      })
    } catch (err) {
      console.error(err)
      throw new Error(
        'An error occured when deleting one or multiple conversations'
      )
    }
  }

  async acceptConversation(acceptConversationDto: AcceptConvDto) {
    await this.prismaService.conversation.update({
      where: { id: acceptConversationDto.conversationId },
      data: {
        InvitationConversation: {
          delete: true,
        },
      },
    })
  }
}
