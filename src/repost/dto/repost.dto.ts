import { IsNotEmpty } from 'class-validator'

export class RepostDto {
  @IsNotEmpty()
  readonly postId: string

  @IsNotEmpty()
  readonly userId: string
}
