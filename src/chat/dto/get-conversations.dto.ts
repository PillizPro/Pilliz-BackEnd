import { PickType } from '@nestjs/swagger'
import { CreateConversationDto } from './create-conversation.dto'

export class GetConversationsDto extends PickType(CreateConversationDto, [
  'userId',
] as const) {}
