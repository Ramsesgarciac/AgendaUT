import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { TipoArea } from '../tipo-area/entities/tipo-area.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([Area, Usuario, TipoArea]), // Esto es crucial
      ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule {}
