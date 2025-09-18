import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividades } from './entities/actividade.entity';
import { ColeccionComentarios } from 'src/coleccion-comentario/entities/coleccion-comentario.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Actividades, ColeccionComentarios]), // Esto es crucial
    ],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports:[ActividadesService]
})
export class ActividadesModule {}
