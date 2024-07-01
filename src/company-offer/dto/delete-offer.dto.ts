import { IsNotEmpty } from 'class-validator'

export class DeleteCompanyOfferDto {
  @IsNotEmpty()
  readonly postId: string
}
