import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class IdentifyUsersDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string

  @IsString()
  readonly content: string

  @IsArray()
  readonly usersTag: string[]
}
