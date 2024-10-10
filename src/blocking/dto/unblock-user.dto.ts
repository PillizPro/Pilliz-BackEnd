import { IsNotEmpty } from 'class-validator'

export class UnblockUserDto {
  @IsNotEmpty()
  readonly userToUnblock: string
}
