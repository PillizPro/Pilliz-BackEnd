import { IsUUID } from 'class-validator'

export class CreateConversationDto {
  @IsUUID()
  readonly receiverId: string

  @IsUUID()
  readonly userId: string
}
