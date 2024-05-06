import { Test, TestingModule } from '@nestjs/testing'
import { CompanyOfferController } from './company-offer.controller'

describe('CompanyOfferController', () => {
  let controller: CompanyOfferController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyOfferController],
    }).compile()

    controller = module.get<CompanyOfferController>(CompanyOfferController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
