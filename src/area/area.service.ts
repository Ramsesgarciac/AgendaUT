import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { TipoArea } from '../tipo-area/entities/tipo-area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(TipoArea)
    private readonly tipoAreaRepository: Repository<TipoArea>
  ){}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    // Crear el área
    const area = this.areaRepository.create({
      nombre: createAreaDto.nombre,
    });

    // Si se proporciona un tipoAreaId, buscar el tipoArea y asignarlo
    if (createAreaDto.tipoAreaId) {
      const tipoArea = await this.tipoAreaRepository.findOne({
        where: { id: createAreaDto.tipoAreaId }
      });

      if (!tipoArea) {
        throw new NotFoundException(`TipoArea con ID ${createAreaDto.tipoAreaId} no encontrado`);
      }

      area.tipoArea = tipoArea;
    }

    // Si se proporciona un usuarioId, buscar el usuario y asignarlo
    if (createAreaDto.usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: createAreaDto.usuarioId }
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${createAreaDto.usuarioId} no encontrado`);
      }

      area.usuarios = [usuario]; // ManyToMany requiere array
    }

    return this.areaRepository.save(area);
  }

  async findAll(): Promise<Area[]> {
    return this.areaRepository.find({
      relations: ['usuarios', 'actividades', 'notas', 'tipoArea'] // Cambiar 'usuario' por 'usuarios'
    });
  }

  async findOne(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['usuarios', 'actividades', 'notas', 'tipoArea'] // Cambiar 'usuario' por 'usuarios'
    });

    if (!area) {
      throw new NotFoundException(`Area con el ID ${id} no encontrado`);
    }

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const area = await this.findOne(id);

    // Actualizar nombre si se proporciona
    if (updateAreaDto.nombre) {
      area.nombre = updateAreaDto.nombre;
    }

    // Si se proporciona un nuevo tipoAreaId
    if (updateAreaDto.tipoAreaId) {
      const tipoArea = await this.tipoAreaRepository.findOne({
        where: { id: updateAreaDto.tipoAreaId }
      });

      if (!tipoArea) {
        throw new NotFoundException(`TipoArea con ID ${updateAreaDto.tipoAreaId} no encontrado`);
      }

      area.tipoArea = tipoArea;
    }

    // Si se proporciona un nuevo usuarioId
    if (updateAreaDto.usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: updateAreaDto.usuarioId }
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${updateAreaDto.usuarioId} no encontrado`);
      }

      // Reemplazar la lista de usuarios (o puedes agregar a la lista existente)
      area.usuarios = [usuario];
    }

    return this.areaRepository.save(area);
  }

  // Método adicional para agregar un usuario a un área existente
  async addUsuarioToArea(areaId: number, usuarioId: number): Promise<Area> {
    const area = await this.findOne(areaId);
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Verificar si el usuario ya está asignado al área
    const usuarioExistente = area.usuarios.find(u => u.id === usuarioId);
    if (!usuarioExistente) {
      area.usuarios.push(usuario);
    }

    return this.areaRepository.save(area);
  }

  // Método adicional para remover un usuario de un área
  async removeUsuarioFromArea(areaId: number, usuarioId: number): Promise<Area> {
    const area = await this.findOne(areaId);
    
    area.usuarios = area.usuarios.filter(usuario => usuario.id !== usuarioId);
    
    return this.areaRepository.save(area);
  }

  async remove(id: number): Promise<void> {
    const area = await this.findOne(id);
    await this.areaRepository.remove(area);
  }
}