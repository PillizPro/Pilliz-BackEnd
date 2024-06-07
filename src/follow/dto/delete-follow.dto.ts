import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteFollowDto {
  @IsNotEmpty()
  @IsString()
  readonly followingId: string
}
