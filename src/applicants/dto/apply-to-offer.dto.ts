import { IsNotEmpty, IsString } from 'class-validator'

export class ApplyToOfferDto {
  @IsNotEmpty()
  @IsString()
  readonly offerId: string
}
