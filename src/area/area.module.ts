import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([Area, Usuario]), // Esto es crucial
      ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule {}
