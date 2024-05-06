import { IsUUID } from 'class-validator'

export class DeleteChatDto {
  @IsUUID()
  readonly messageId: string
}
