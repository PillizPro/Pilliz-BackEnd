import { IsNotEmpty } from 'class-validator'

export class DeletePostDto {
  @IsNotEmpty()
  readonly postId: string
}
