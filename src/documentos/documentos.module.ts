import { Module } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documentos } from './entities/documento.entity';
import { Entrega } from '../entrega/entities/entrega/entrega.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([Documentos, Entrega]), // Esto es crucial
      ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
  exports: [DocumentosService]
})
export class DocumentosModule {}
