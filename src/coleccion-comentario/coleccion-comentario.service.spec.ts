import { Test, TestingModule } from '@nestjs/testing';
import { ColeccionComentarioService } from './coleccion-comentario.service';

describe('ColeccionComentarioService', () => {
  let service: ColeccionComentarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColeccionComentarioService],
    }).compile();

    service = module.get<ColeccionComentarioService>(ColeccionComentarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
