import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividades } from './entities/actividade.entity';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividades)
    private readonly actividadesRepository: Repository<Actividades>,
  ) {}

  async create(createActividadesDto: CreateActividadeDto): Promise<Actividades> {
  const actividad = this.actividadesRepository.create({
    asunto: createActividadesDto.asunto,
    instanciaReceptora: createActividadesDto.instanciaReceptora,
    instanciaEmisora: createActividadesDto.instanciaEmisora,
    tipoActividad: createActividadesDto.tipoActividad,
    fechaLimite: new Date(createActividadesDto.fechaLimite), // Convertir aquí
    area: { id: createActividadesDto.idArea },
    userCreate: { id: createActividadesDto.idUserCreate },
    status: { id: createActividadesDto.statusId },
  });

  return this.actividadesRepository.save(actividad);
}

  async findAll(): Promise<Actividades[]> {
    return this.actividadesRepository.find({
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios'],
    });
  }

  async findOne(id: number): Promise<Actividades> {
    const actividad = await this.actividadesRepository.findOne({
      where: { id },
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios'],
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return actividad;
  }

  async update(id: number, updateActividadesDto: UpdateActividadeDto): Promise<Actividades> {
    const actividad = await this.findOne(id);

    if (updateActividadesDto.idArea) {
      actividad.area = { id: updateActividadesDto.idArea } as any;
    }

    if (updateActividadesDto.statusId) {
      actividad.status = { id: updateActividadesDto.statusId } as any;
    }

    Object.assign(actividad, {
      asunto: updateActividadesDto.asunto || actividad.asunto,
      instanciaReceptora: updateActividadesDto.instanciaReceptora || actividad.instanciaReceptora,
      instanciaEmisora: updateActividadesDto.instanciaEmisora || actividad.instanciaEmisora,
      tipoActividad: updateActividadesDto.tipoActividad || actividad.tipoActividad,
      fechaLimite: updateActividadesDto.fechaLimite || actividad.fechaLimite,
    });

    return this.actividadesRepository.save(actividad);
  }

  async remove(id: number): Promise<void> {
    const actividad = await this.findOne(id);
    await this.actividadesRepository.remove(actividad);
  }

  async findByArea(areaId: number): Promise<Actividades[]> {
    return this.actividadesRepository.find({
      where: { area: { id: areaId } },
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios'],
    });
  }

  async findByUser(userId: number): Promise<Actividades[]> {
    return this.actividadesRepository.find({
      where: { userCreate: { id: userId } },
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios'],
    });
  }
}