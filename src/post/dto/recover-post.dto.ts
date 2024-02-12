import { IsNotEmpty } from 'class-validator'

export class RecoverPostDto {
  @IsNotEmpty()
  readonly userId: string
}
