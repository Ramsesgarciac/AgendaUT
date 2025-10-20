import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Area } from '../area/entities/area.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Area]), // Esto es crucial
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService], 
})
export class UsuarioModule {}
