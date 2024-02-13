import { IsNotEmpty } from 'class-validator'

export class DeleteCommentResponseDto {
  @IsNotEmpty()
  readonly commentId: string
}
