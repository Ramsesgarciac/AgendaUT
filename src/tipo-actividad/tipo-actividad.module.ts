import { Module } from '@nestjs/common';
import { TipoActividadService } from './tipo-actividad.service';
import { TipoActividadController } from './tipo-actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoActividad } from './entities/tipo-actividad.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([TipoActividad]), // Esto es crucial
      ],
  controllers: [TipoActividadController],
  providers: [TipoActividadService],
  exports: [TipoActividadService]
})
export class TipoActividadModule {}
