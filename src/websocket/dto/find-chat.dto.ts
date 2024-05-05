import { IsOptional, IsUUID } from 'class-validator'

export class FindChatDto {
  @IsUUID()
  @IsOptional()
  readonly conversationId?: string

  @IsUUID()
  readonly userId: string

  @IsUUID()
  @IsOptional()
  readonly receiverId?: string
}
