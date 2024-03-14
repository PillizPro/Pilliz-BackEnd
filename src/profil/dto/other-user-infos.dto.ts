import { IsNotEmpty } from 'class-validator'

export class UserFetchInfos {
  @IsNotEmpty()
  readonly userId: string
}
