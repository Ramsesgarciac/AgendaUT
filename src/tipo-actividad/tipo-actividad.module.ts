import { Module } from '@nestjs/common';
import { TipoActividadService } from './tipo-actividad.service';
import { TipoActividadController } from './tipo-actividad.controller';

@Module({
  controllers: [TipoActividadController],
  providers: [TipoActividadService],
})
export class TipoActividadModule {}
