import { IsArray } from 'class-validator'

export class IdentifyUsersDto {
  @IsArray()
  readonly usersTag: string[]
}
