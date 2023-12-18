import { PickType } from '@nestjs/swagger'
import { CreateChatDto } from './create-chat.dto'

export class FindChatDto extends PickType(CreateChatDto, [
  'conversationId',
] as const) {}
