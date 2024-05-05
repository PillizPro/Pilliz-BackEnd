import { IsNotEmpty } from 'class-validator'

export class HideUserDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly userToHide: string
}
