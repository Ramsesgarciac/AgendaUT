import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comentarios } from './entities/comentario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentarios)
    private readonly comentariosRepository: Repository<Comentarios>
  ){}
  
  async create(createComentarioDto: CreateComentarioDto): Promise<Comentarios> {
  const comentarioData: Partial<Comentarios> = {
    contenido: createComentarioDto.contenido,
    usuario: { id: createComentarioDto.idUsuario } as any,
    actividad: { id: createComentarioDto.idActividad } as any
  };

  if (createComentarioDto.idColeccion) {
    comentarioData.coleccion = { id: createComentarioDto.idColeccion } as any;
  }

  // Usar directamente save sin create
  const comentario = await this.comentariosRepository.save(comentarioData);
  return comentario;
}

  async findAll(): Promise<Comentarios[]> {
    return this.comentariosRepository.find({
      relations: ['usuario', 'actividad']
    });
  }

  async findOne(id: number): Promise<Comentarios> {
    const comentario = await this.comentariosRepository.findOne({
      where: {id},
      relations: ['usuario', 'actividad']
    })

    if(!comentario){
      throw new NotFoundException(`El comentario con el ${id} no encontrado`)
    }
    return comentario;
  }

  async update(id: number, updateComentarioDto: UpdateComentarioDto): Promise<Comentarios> {
  const coment = await this.findOne(id);

  if (updateComentarioDto.idActividad) {
    coment.actividad = { id: updateComentarioDto.idActividad } as any;
  }

  if (updateComentarioDto.idUsuario) {
    coment.usuario = { id: updateComentarioDto.idUsuario } as any;
  }

  if (updateComentarioDto.idColeccion) {
    coment.coleccion = { id: updateComentarioDto.idColeccion } as any;
  }

  Object.assign(coment, {
    contenido: updateComentarioDto.contenido || coment.contenido,
    // Corregir esta línea - tenía un error:
    actividad: updateComentarioDto.idActividad ? { id: updateComentarioDto.idActividad } : coment.actividad,
    usuario: updateComentarioDto.idUsuario ? { id: updateComentarioDto.idUsuario } : coment.usuario
  });

  return this.comentariosRepository.save(coment);
}

  async remove(id: number): Promise<void> {
    const comentario = await this.findOne(id);
    await this.comentariosRepository.remove(comentario);
  }
}