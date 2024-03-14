import { IsNotEmpty } from 'class-validator'

export class ChangeBioDto {
  @IsNotEmpty()
  readonly id: string

  @IsNotEmpty()
  readonly bio: string
}
