import { IsNotEmpty } from 'class-validator'

export class AddCountryToUserDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly country: string
}
