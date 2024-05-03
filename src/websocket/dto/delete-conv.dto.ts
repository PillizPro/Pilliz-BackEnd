import { IsArray, IsNotEmpty, IsUUID } from 'class-validator'

export class DeleteConvDto {
  @IsUUID()
  readonly userId: string

  @IsArray()
  @IsNotEmpty()
  readonly conversationId: string[]
}
