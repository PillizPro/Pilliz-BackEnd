import { IsNotEmpty } from 'class-validator'

export class FetchCommentDto {
  @IsNotEmpty()
  readonly postId: string
}
