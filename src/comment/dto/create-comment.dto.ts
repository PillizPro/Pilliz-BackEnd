import { IsNotEmpty } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  readonly postId: string

  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly content: string
}
