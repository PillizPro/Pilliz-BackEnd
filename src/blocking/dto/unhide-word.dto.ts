import { IsNotEmpty } from 'class-validator'

export class UnhideWordDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly wordToUnhide: string
}
