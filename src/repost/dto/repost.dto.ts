import { IsNotEmpty, IsOptional } from 'class-validator';

export class RepostDto {
  @IsOptional()
  readonly postId?: string;

  @IsOptional()
  readonly commentId?: string;

  @IsNotEmpty()
  readonly userId: string;
}
