import { IsNotEmpty } from 'class-validator'

export class ChangeBioDto {
  @IsNotEmpty()
  readonly bio: string
}
