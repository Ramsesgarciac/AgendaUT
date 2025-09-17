// src/coleccion-comentarios/coleccion-comentarios.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ColeccionComentarios } from './entities/coleccion-comentario.entity';
import { CreateColeccionComentarioDto } from './dto/create-coleccion-comentario.dto';
import { Comentarios } from '../comentarios/entities/comentario.entity';

@Injectable()
export class ColeccionComentariosService {
  constructor(
    @InjectRepository(ColeccionComentarios)
    private readonly coleccionRepository: Repository<ColeccionComentarios>,
    @InjectRepository(Comentarios)
    private readonly comentariosRepository: Repository<Comentarios>
  ) {}

  async create(createDto: CreateColeccionComentarioDto): Promise<ColeccionComentarios> {
    const coleccion = this.coleccionRepository.create(createDto);
    return await this.coleccionRepository.save(coleccion);
  }

  async findAll(): Promise<ColeccionComentarios[]> {
    return await this.coleccionRepository.find({
      relations: ['comentarios', 'comentarios.usuario', 'comentarios.actividad'],
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findOne(id: number): Promise<ColeccionComentarios> {
    const coleccion = await this.coleccionRepository.findOne({
      where: { id },
      relations: ['comentarios', 'comentarios.usuario', 'comentarios.actividad']
    });

    if (!coleccion) {
      throw new NotFoundException(`Colección con ID ${id} no encontrada`);
    }

    return coleccion;
  }

  async agregarComentarios(idColeccion: number, idsComentarios: number[]): Promise<ColeccionComentarios> {
    const coleccion = await this.findOne(idColeccion);
    const comentarios = await this.comentariosRepository.findByIds(idsComentarios);

    // Asignar la colección a cada comentario
    comentarios.forEach(comentario => {
      comentario.coleccion = coleccion;
    });

    await this.comentariosRepository.save(comentarios);

    // Recargar la colección con los comentarios actualizados
    return await this.findOne(idColeccion);
  }

  async removerComentarios(idColeccion: number, idsComentarios: number[]): Promise<ColeccionComentarios> {
    const comentarios = await this.comentariosRepository.find({
        where: { 
          id: In(idsComentarios),
          coleccion: { id: idColeccion } 
        }
      });

    // Remover la colección de los comentarios
    comentarios.forEach(comentario => {
      comentario.coleccion = undefined as any;
    });

    await this.comentariosRepository.save(comentarios);

    return await this.findOne(idColeccion);
  }

  async delete(id: number): Promise<void> {
    const coleccion = await this.findOne(id);
    
    // Remover la colección de todos los comentarios asociados
    if (coleccion.comentarios && coleccion.comentarios.length > 0) {
      coleccion.comentarios.forEach(comentario => {
        comentario.coleccion = undefined as any;
      });
      await this.comentariosRepository.save(coleccion.comentarios);
    }

    await this.coleccionRepository.remove(coleccion);
  }
}