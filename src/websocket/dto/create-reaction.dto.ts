import { IsArray, IsUUID } from 'class-validator'

export class CreateReactionDto {
  @IsUUID()
  readonly authorId: string

  @IsArray()
  readonly reactions: string[]

  @IsUUID()
  readonly messageId: string
}
