import { IsNotEmpty } from 'class-validator'

export class UnhideUserDto {
  @IsNotEmpty()
  readonly userToUnhide: string
}
