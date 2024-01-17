import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('getConversations/:userId')
  async getConversations(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return await this.chatService.getConversations(userId)
  }

  @Post('createConversation')
  async createConversation() {
    return await this.chatService.createConversation()
  }
}
