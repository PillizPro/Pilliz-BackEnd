import { IsNotEmpty } from 'class-validator'

export class AddKeyActivityTimeToUserDto {
  @IsNotEmpty()
  readonly activityTime: number
}
