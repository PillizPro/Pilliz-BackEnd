import { IsUUID } from 'class-validator'

export class GetConversationsDto {
  @IsUUID()
  readonly userId: string
}
