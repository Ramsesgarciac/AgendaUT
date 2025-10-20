import { Module } from '@nestjs/common';
import { ColeccionComentariosService } from './coleccion-comentario.service';
import { ColeccionComentariosController } from './coleccion-comentario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColeccionComentarios } from './entities/coleccion-comentario.entity';
import { Comentarios } from '../comentarios/entities/comentario.entity';

@Module({
  imports: [
          TypeOrmModule.forFeature([ColeccionComentarios, Comentarios]), // Esto es crucial
        ],
  controllers: [ColeccionComentariosController],
  providers: [ColeccionComentariosService],
  exports:[ColeccionComentariosService]
})
export class ColeccionComentarioModule {}
