import { Test, TestingModule } from '@nestjs/testing';
import { ColeccionComentarioController } from './coleccion-comentario.controller';
import { ColeccionComentarioService } from './coleccion-comentario.service';

describe('ColeccionComentarioController', () => {
  let controller: ColeccionComentarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColeccionComentarioController],
      providers: [ColeccionComentarioService],
    }).compile();

    controller = module.get<ColeccionComentarioController>(ColeccionComentarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
