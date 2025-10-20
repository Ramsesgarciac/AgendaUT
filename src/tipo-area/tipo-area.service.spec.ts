import { Test, TestingModule } from '@nestjs/testing';
import { TipoAreaService } from './tipo-area.service';

describe('TipoAreaService', () => {
  let service: TipoAreaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoAreaService],
    }).compile();

    service = module.get<TipoAreaService>(TipoAreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
