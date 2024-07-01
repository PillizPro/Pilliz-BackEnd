import { Test, TestingModule } from '@nestjs/testing'
import { WSGateway } from './websocket.gateway'
import { ChatService } from './chat.service'

describe('WSGateway', () => {
  let gateway: WSGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WSGateway, ChatService],
    }).compile()

    gateway = module.get<WSGateway>(WSGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})
