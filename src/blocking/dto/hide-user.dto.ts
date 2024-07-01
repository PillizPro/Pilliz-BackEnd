import { IsNotEmpty } from 'class-validator'

export class HideUserDto {
  @IsNotEmpty()
  readonly userToHide: string
}
