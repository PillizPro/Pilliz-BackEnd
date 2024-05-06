import { CompanyOffer } from '@prisma/client'
import { UserEntity } from 'src/user/entities/user.entity'

export class OfferEntity implements CompanyOffer {
  constructor(partial: Partial<OfferEntity>) {
    Object.assign(this, partial)
  }
  id: string
  userId: string
  content: string
  createdAt: Date
  user: UserEntity
  isCompanyOffer: boolean
  companyOfferTitle: string
  companyOfferDiploma: string
  companyOfferSkills: string
  companyOfferContractType: string
  companyOfferContractDuration: string
  companyOfferSalary: string
}
