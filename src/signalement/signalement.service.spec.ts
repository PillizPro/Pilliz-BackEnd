import { Test, TestingModule } from '@nestjs/testing';
import { SignalementService } from './signalement.service';

describe('SignalementService', () => {
  let service: SignalementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignalementService],
    }).compile();

    service = module.get<SignalementService>(SignalementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
