import { IsNotEmpty } from 'class-validator'

export class PostOrCommentTypeDto {
  @IsNotEmpty()
  readonly postId: string
}
