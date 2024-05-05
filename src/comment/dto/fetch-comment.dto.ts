import { IsNotEmpty } from 'class-validator'

export class FetchCommentDto {
  @IsNotEmpty()
  readonly postId: string

  @IsNotEmpty()
  readonly userId: string
}
