import { IsNotEmpty } from 'class-validator'

export class AddAppTimeToUserDto {
  @IsNotEmpty()
  readonly appTime: number
}
