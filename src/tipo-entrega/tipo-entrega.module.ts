import { Module } from '@nestjs/common';
import { TipoEntregaService } from './tipo-entrega.service';
import { TipoEntregaController } from './tipo-entrega.controller';

@Module({
  controllers: [TipoEntregaController],
  providers: [TipoEntregaService],
})
export class TipoEntregaModule {}
