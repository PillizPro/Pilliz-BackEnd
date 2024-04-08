import { IsNotEmpty } from 'class-validator'

export class AddAppTimeToUserDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly appTime: number
}
