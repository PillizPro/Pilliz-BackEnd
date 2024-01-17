import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateChatDto {
  @IsUUID()
  readonly conversationId: string

  @IsUUID()
  readonly authorId: string

  @IsNotEmpty()
  readonly content: string
}
