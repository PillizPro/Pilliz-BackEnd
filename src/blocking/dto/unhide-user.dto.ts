import { IsNotEmpty } from 'class-validator'

export class UnhideUserDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly userToUnhide: string
}
