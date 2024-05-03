import { IsArray, IsNotEmpty } from 'class-validator'

export class DeleteConvDto {
  @IsArray()
  @IsNotEmpty()
  readonly conversationId: string[]
}
