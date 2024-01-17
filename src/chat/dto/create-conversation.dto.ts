import { IsUUID } from 'class-validator'

export class CreateConversationDto {
  @IsUUID()
  readonly userId: string

  @IsUUID()
  readonly receiverId: string
}
