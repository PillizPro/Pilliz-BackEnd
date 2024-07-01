import { IsUUID } from 'class-validator'

export class FindAllUsersConvDto {
  @IsUUID()
  readonly conversationId: string

  @IsUUID()
  readonly userId: string
}
