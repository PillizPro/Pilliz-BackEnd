import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFollowDto {
  @IsNotEmpty()
  @IsString()
  readonly followerId: string

  @IsNotEmpty()
  @IsString()
  readonly followingId: string
}
