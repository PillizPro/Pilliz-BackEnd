import { IsUUID, ValidateIf } from 'class-validator'

export class FindChatDto {
  @IsUUID()
  @ValidateIf(
    (object: FindChatDto, value) =>
      object.receiverId === undefined && value !== undefined
  )
  readonly conversationId: string

  @IsUUID()
  readonly userId: string

  @IsUUID()
  @ValidateIf(
    (object: FindChatDto, value) =>
      object.conversationId === undefined && value !== undefined
  )
  readonly receiverId: string
}
