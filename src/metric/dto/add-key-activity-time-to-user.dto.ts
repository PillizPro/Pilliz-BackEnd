import { IsNotEmpty } from 'class-validator'

export class AddKeyActivityTimeToUserDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly activityTime: number
}
