// src/coleccion-comentario/coleccion-comentario.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ColeccionComentarios } from './entities/coleccion-comentario.entity';
import { Comentarios } from '../comentarios/entities/comentario.entity';
import { CreateColeccionComentarioDto } from './dto/create-coleccion-comentario.dto';
import { UpdateColeccionComentarioDto } from './dto/update-coleccion-comentario.dto';

@Injectable()
export class ColeccionComentariosService {
  constructor(
    @InjectRepository(ColeccionComentarios)
    private readonly coleccionComentariosRepository: Repository<ColeccionComentarios>,
    @InjectRepository(Comentarios)
    private readonly comentariosRepository: Repository<Comentarios>
  ) {}

  // Crear una nueva colección de comentarios
  async create(createColeccionComentarioDto: CreateColeccionComentarioDto): Promise<ColeccionComentarios> {
    const coleccion = this.coleccionComentariosRepository.create({
      actividad: { id: createColeccionComentarioDto.idActividad }
    });

    return await this.coleccionComentariosRepository.save(coleccion);
  }

  // Obtener todas las colecciones
  async findAll(): Promise<ColeccionComentarios[]> {
    return await this.coleccionComentariosRepository.find({
      relations: ['actividad', 'comentarios', 'comentarios.usuario']
    });
  }

  // Obtener colecciones por actividad
  async findByActividad(idActividad: number): Promise<ColeccionComentarios[]> {
    return await this.coleccionComentariosRepository.find({
      where: { actividad: { id: idActividad } },
      relations: ['comentarios', 'comentarios.usuario']
    });
  }

  // Obtener una colección específica
  async findOne(id: number): Promise<ColeccionComentarios> {
    const coleccion = await this.coleccionComentariosRepository.findOne({
      where: { id },
      relations: ['actividad', 'comentarios', 'comentarios.usuario']
    });

    if (!coleccion) {
      throw new NotFoundException(`Colección de comentarios con ID ${id} no encontrada`);
    }

    return coleccion;
  }

  // Actualizar una colección
  async update(id: number, updateColeccionComentarioDto: UpdateColeccionComentarioDto): Promise<ColeccionComentarios> {
    const coleccion = await this.findOne(id);
    
    if (updateColeccionComentarioDto.idActividad) {
      coleccion.actividad = { id: updateColeccionComentarioDto.idActividad } as any;
    }

    return await this.coleccionComentariosRepository.save(coleccion);
  }

  // Eliminar una colección
  async remove(id: number): Promise<void> {
    const coleccion = await this.findOne(id);
    
    // Primero, desasociar todos los comentarios de esta colección
    await this.comentariosRepository.update(
      { coleccion: { id } },
      { coleccion: null as any }
    );

    // Luego eliminar la colección
    await this.coleccionComentariosRepository.remove(coleccion);
  }

  // Agregar comentarios a una colección
  async agregarComentarios(idColeccion: number, idsComentarios: number[]): Promise<ColeccionComentarios> {
    const coleccion = await this.findOne(idColeccion);

    // Actualizar los comentarios para que pertenezcan a esta colección
    await this.comentariosRepository.update(
      { id: In(idsComentarios) },
      { coleccion: { id: idColeccion } }
    );

    return await this.findOne(idColeccion);
  }

  // Quitar comentarios de una colección
  async quitarComentarios(idColeccion: number, idsComentarios: number[]): Promise<ColeccionComentarios> {
    const coleccion = await this.findOne(idColeccion);

    // Verificar que los comentarios pertenezcan a esta colección
    const comentarios = await this.comentariosRepository.find({
      where: { 
        id: In(idsComentarios),
        coleccion: { id: idColeccion } 
      }
    });

    // Desasociar los comentarios de la colección
    for (const comentario of comentarios) {
      comentario.coleccion = null as any;
    }

    await this.comentariosRepository.save(comentarios);
    return await this.findOne(idColeccion);
  }
}