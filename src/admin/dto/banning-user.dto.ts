import { IsNotEmpty } from 'class-validator'

export class BanningUserDto {
  @IsNotEmpty()
  readonly id: string
}
