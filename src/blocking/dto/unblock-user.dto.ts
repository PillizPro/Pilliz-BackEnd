import { IsNotEmpty } from 'class-validator'

export class UnblockUserDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly userToUnblock: string
}
