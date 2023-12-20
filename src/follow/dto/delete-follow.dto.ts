import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteFollowDto {
  @IsNotEmpty()
  @IsString()
  readonly followerId: string

  @IsNotEmpty()
  @IsString()
  readonly followingId: string
}
