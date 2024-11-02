import { IsNotEmpty } from 'class-validator'

export class FavoritePostDto {
  @IsNotEmpty()
  readonly postId: string
}
