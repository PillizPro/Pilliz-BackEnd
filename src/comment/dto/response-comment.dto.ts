import { IsNotEmpty } from 'class-validator'

export class ResponseCommentDto {
  @IsNotEmpty()
  readonly postId: string

  @IsNotEmpty()
  readonly content: string

  @IsNotEmpty()
  readonly parentId: string
}
