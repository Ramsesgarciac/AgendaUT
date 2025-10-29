import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntregaController } from './entrega.controller';
import { EntregaService } from './entrega.service';
import { Entrega } from './entities/entrega/entrega.entity';
import { Documentos } from '../documentos/entities/documento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrega, Documentos])],
  controllers: [EntregaController],
  providers: [EntregaService]
})
export class EntregaModule {}
