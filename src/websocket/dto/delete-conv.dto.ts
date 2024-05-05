import { IsArray, IsNotEmpty, IsUUID } from 'class-validator'

export class DeleteConvDto {
  @IsUUID()
  readonly userId: string

  @IsArray()
  @IsNotEmpty()
  readonly conversationsId: string[]

  @IsArray()
  readonly invitations: boolean[]
}
