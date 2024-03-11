import { IsNotEmpty, IsOptional } from 'class-validator'

export class ReportingPostCommentDto {
  @IsNotEmpty()
  readonly reportedBy: string

  @IsOptional()
  readonly postId?: string

  @IsOptional()
  readonly commentId?: string

  @IsNotEmpty()
  readonly reportedFor: string
}
