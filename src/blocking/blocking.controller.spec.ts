import { Test, TestingModule } from '@nestjs/testing'
import { BlockingController } from './blocking.controller'

describe('BlockingController', () => {
  let controller: BlockingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockingController],
    }).compile()

    controller = module.get<BlockingController>(BlockingController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
