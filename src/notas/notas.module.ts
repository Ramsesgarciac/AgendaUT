import { Module } from '@nestjs/common';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notas } from './entities/nota.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Area } from 'src/area/entities/area.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Notas, Usuario, Area]), // Esto es crucial
    ],
  controllers: [NotasController],
  providers: [NotasService],
  exports: [NotasService]
})
export class NotasModule {}
