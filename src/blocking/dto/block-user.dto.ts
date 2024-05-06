import { IsNotEmpty } from 'class-validator'

export class BlockUserDto {
  @IsNotEmpty()
  readonly userToBlock: string
}
