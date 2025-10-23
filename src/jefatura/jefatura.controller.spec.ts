import { Test, TestingModule } from '@nestjs/testing';
import { JefaturaController } from './jefatura.controller';
import { JefaturaService } from './jefatura.service';

describe('JefaturaController', () => {
  let controller: JefaturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JefaturaController],
      providers: [JefaturaService],
    }).compile();

    controller = module.get<JefaturaController>(JefaturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
