import { Module } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documentos } from './entities/documento.entity';
import { Entrega } from '../entrega/entities/entrega/entrega.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([Documentos, Entrega, Usuario]), // Esto es crucial
      ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
  exports: [DocumentosService]
})
export class DocumentosModule {}
