import { IsNotEmpty } from 'class-validator'

export class ViewInterractPostDto {
  @IsNotEmpty()
  readonly postId: string
}
