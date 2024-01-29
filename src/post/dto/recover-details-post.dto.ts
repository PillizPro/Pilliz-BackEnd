import { IsNotEmpty } from 'class-validator'

export class RecoverDetailsPostDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly postId: string
}
