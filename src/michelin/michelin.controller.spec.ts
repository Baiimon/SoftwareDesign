import { Test, TestingModule } from '@nestjs/testing';
import { MichelinController } from './michelin.controller';

describe('MichelinController', () => {
  let controller: MichelinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MichelinController],
    }).compile();

    controller = module.get<MichelinController>(MichelinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
