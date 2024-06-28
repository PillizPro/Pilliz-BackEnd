import { IsIn, IsNotEmpty, IsUUID } from 'class-validator'

export class CreateChatDto {
  @IsUUID()
  readonly conversationId: string

  @IsUUID()
  readonly authorId: string

  @IsNotEmpty()
  readonly content: string

  @IsNotEmpty()
  @IsIn([0, 1, 2, 3, 4])
  readonly type: number
}
