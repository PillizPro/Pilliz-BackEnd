import { IsNotEmpty } from 'class-validator'

export class PinnedPostDto {
  @IsNotEmpty()
  readonly postId: string
}
