import { IsNotEmpty } from 'class-validator'

export class BlockUserDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly userToBlock: string
}
