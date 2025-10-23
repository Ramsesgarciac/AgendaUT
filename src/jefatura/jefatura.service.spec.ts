import { Test, TestingModule } from '@nestjs/testing';
import { JefaturaService } from './jefatura.service';

describe('JefaturaService', () => {
  let service: JefaturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JefaturaService],
    }).compile();

    service = module.get<JefaturaService>(JefaturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
