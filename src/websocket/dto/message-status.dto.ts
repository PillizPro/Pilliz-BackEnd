import { IsUUID } from 'class-validator'

export class MessageStatusDto {
  @IsUUID()
  readonly idMessage: string
}
