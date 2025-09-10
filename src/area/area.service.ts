import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>
  ){}
  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const areas = this.areaRepository.create({
      nombre: createAreaDto.nombre,
      usuario: {id: createAreaDto.usuarioId}
    })
    return this.areaRepository.save(areas)
  }

  async findAll(): Promise<Area[]> {
    return this.areaRepository.find({
      relations: ['usuario', 'actividades', 'notas']
    });
  }

  async findOne(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: {id},
      relations: ['usuario', 'actividades', 'notas']
    })

    if(!area){
      throw new NotFoundException(`Area con el ID ${id} no encontrado`)
    }

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const area = await this.findOne(id);
    if(updateAreaDto.usuarioId){
      area.usuario = { id: updateAreaDto.usuarioId } as any;
    }

    Object.assign(area,{
      nombre:updateAreaDto.nombre || area.nombre
    });
    return this.areaRepository.save(area);
  }

  async remove(id: number) {
    const area = await this.findOne(id);
    await this.areaRepository.remove(area)
  }
}
