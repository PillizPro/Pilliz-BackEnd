import { IsOptional } from 'class-validator'

export class LikePostDto {
  @IsOptional()
  readonly postId?: string

  @IsOptional()
  readonly commentId?: string
}
