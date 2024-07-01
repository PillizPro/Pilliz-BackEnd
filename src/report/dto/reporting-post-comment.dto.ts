import { IsNotEmpty, IsOptional } from 'class-validator'

export class ReportingPostCommentDto {
  @IsOptional()
  readonly postId?: string

  @IsOptional()
  readonly commentId?: string

  @IsNotEmpty()
  readonly reportedFor: string
}
