import { Test, TestingModule } from '@nestjs/testing';
import { TipoActividadController } from './tipo-actividad.controller';
import { TipoActividadService } from './tipo-actividad.service';

describe('TipoActividadController', () => {
  let controller: TipoActividadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoActividadController],
      providers: [TipoActividadService],
    }).compile();

    controller = module.get<TipoActividadController>(TipoActividadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
