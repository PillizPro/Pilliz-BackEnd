import { IsNotEmpty } from 'class-validator'

export class LikePostDto {
  @IsNotEmpty()
  readonly postId: string

  @IsNotEmpty()
  readonly userId: string
}
