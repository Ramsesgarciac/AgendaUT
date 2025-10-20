import { Test, TestingModule } from '@nestjs/testing';
import { TipoAreaController } from './tipo-area.controller';
import { TipoAreaService } from './tipo-area.service';

describe('TipoAreaController', () => {
  let controller: TipoAreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoAreaController],
      providers: [TipoAreaService],
    }).compile();

    controller = module.get<TipoAreaController>(TipoAreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
