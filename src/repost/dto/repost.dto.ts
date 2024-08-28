import { IsOptional } from 'class-validator'

export class RepostDto {
  @IsOptional()
  readonly postId?: string

  @IsOptional()
  readonly commentId?: string
}
