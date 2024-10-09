import { Applicants } from '@prisma/client'
import { UserEntity } from 'src/user/entities/user.entity'
import { OfferEntity } from 'src/company-offer/entities/offer.entity'

export class ApplicantEntity implements Applicants {
  constructor(partial: Partial<ApplicantEntity>) {
    Object.assign(this, partial)
  }
  id: string
  userId: string
  offerId: string
  users: UserEntity
  companyOffer: OfferEntity
  createdAt: Date
}
