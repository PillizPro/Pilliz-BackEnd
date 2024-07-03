import { IsNotEmpty, IsString } from 'class-validator'

export class ApplyToOfferDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string

  @IsNotEmpty()
  @IsString()
  readonly offerId: string
}
