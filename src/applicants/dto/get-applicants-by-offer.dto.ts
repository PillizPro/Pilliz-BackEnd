import { IsNotEmpty, IsString } from 'class-validator'

export class GetApplicantsByOffer {
  @IsNotEmpty()
  @IsString()
  readonly offerId: string
}
