import { Body, Controller, Post } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateConversationDto } from './dto/create-conversation.dto'

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('createConversation')
  async createConversation(
    @Body() createConversationDto: CreateConversationDto
  ) {
    return await this.chatService.createConversation(createConversationDto)
  }
}
