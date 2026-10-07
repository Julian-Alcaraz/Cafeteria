import { Test, TestingModule } from '@nestjs/testing';
import { HoppersService } from './hoppers.service.js';

describe('HoppersService', () => {
  let service: HoppersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoppersService],
    }).compile();

    service = module.get<HoppersService>(HoppersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
