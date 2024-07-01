import { IsNotEmpty } from 'class-validator'

export class AddCountryToUserDto {
  @IsNotEmpty()
  readonly country: string
}
