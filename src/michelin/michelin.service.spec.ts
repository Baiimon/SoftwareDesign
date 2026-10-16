import { Test, TestingModule } from '@nestjs/testing';
import { MichelinService } from './michelin.service';

describe('MichelinService', () => {
  let service: MichelinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MichelinService],
    }).compile();

    service = module.get<MichelinService>(MichelinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
