import { IsNotEmpty } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly content: string
}
