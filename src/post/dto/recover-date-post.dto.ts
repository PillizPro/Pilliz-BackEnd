import { IsNotEmpty } from 'class-validator'

export class RecoverDatePostDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly dateString: Date
}
