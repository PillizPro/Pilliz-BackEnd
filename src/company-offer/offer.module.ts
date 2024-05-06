import { Module } from '@nestjs/common'
import { CompanyOfferController } from './company-offer.controller'
import { OfferService } from './offer.service'

@Module({
  controllers: [CompanyOfferController],
  providers: [OfferService],
})
export class OfferModule {}
