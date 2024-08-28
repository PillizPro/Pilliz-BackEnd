import { IsNotEmpty } from 'class-validator'

export class RecoverDetailsPostDto {
  @IsNotEmpty()
  readonly postId: string
}
