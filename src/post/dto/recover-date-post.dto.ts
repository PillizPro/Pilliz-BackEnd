import { IsNotEmpty } from 'class-validator'

export class RecoverDatePostDto {
  @IsNotEmpty()
  readonly dateString: Date
}
