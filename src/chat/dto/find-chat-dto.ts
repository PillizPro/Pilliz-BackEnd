import { IsUUID } from 'class-validator'

export class FindChatDto {
  @IsUUID()
  readonly conversationId?: string

  @IsUUID()
  readonly userId: string

  @IsUUID()
  readonly receiverId?: string
}
