import { Body, Controller, Post } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ApiTags } from '@nestjs/swagger'
import { DeleteConvDto } from './dto/delete-conv.dto'

@ApiTags('Chat')
@Controller('chat')
export class UserController {
  constructor(private readonly chatService: ChatService) {}

  @Post('deleteConversations')
  async getUsersBySearch(@Body() deleteConvDto: DeleteConvDto) {
    return await this.chatService.deleteConversations(deleteConvDto)
  }
}
