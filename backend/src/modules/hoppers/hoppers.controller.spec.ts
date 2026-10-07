import { Test, TestingModule } from '@nestjs/testing';
import { HoppersController } from './hoppers.controller.js';

describe('HoppersController', () => {
  let controller: HoppersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoppersController],
    }).compile();

    controller = module.get<HoppersController>(HoppersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
