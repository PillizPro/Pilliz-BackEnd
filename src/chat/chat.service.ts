import { Injectable } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
// import { UpdateChatDto } from './dto/update-chat.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FindChatDto } from './dto/find-chat-dto'
import { ChatEntity } from './entities/chat.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async changeConnectedStatus(userId: string, connectedStatus: boolean) {
    try {
      await this.prismaService.users.update({
        where: { id: userId },
        data: { isConnected: connectedStatus },
      })
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when changing connected user status')
    }
  }

  async create(createChatDto: CreateChatDto, receiverConnected: boolean) {
    try {
      const { conversationId, authorId, content, receiverId } = createChatDto
      const newMessage = await this.prismaService.message.create({
        data: {
          authorId,
          content,
          conversationId,
          receiverId,
        },
      })
      if (!receiverConnected) {
        const user = await this.prismaService.users.findUnique({
          where: { id: authorId },
        })
        const userName = user?.name
        this.eventEmitter.emit('createChat', { userName, content })
      }
      return new ChatEntity(newMessage)
    } catch (err) {
      console.error(err)
      throw new Error('An error occured when sending a message')
    }
  }

  async findAll(findChatDto: FindChatDto) {
    try {
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

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   // TO DO
  //   return `This action updates a #${id} chat`
  // }

  // remove(id: number) {
  //   // TO DO
  //   return `This action removes a #${id} chat`
  // }
}
