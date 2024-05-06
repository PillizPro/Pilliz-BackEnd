import { IsNotEmpty } from 'class-validator'

export class HideWordDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly wordToHide: string
}
