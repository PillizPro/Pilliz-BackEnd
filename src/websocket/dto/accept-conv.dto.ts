import { IsUUID } from 'class-validator'

export class AcceptConvDto {
  @IsUUID()
  readonly conversationId: string
}
