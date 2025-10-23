import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jefatura } from './entities/jefatura.entity';
import { CreateJefaturaDto } from './dto/create-jefatura.dto';
import { UpdateJefaturaDto } from './dto/update-jefatura.dto';
import { Area } from '../area/entities/area.entity';

@Injectable()
export class JefaturaService {
  constructor(
    @InjectRepository(Jefatura)
    private readonly jefaturaRepository: Repository<Jefatura>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>
  ) {}

  async create(createJefaturaDto: CreateJefaturaDto): Promise<Jefatura> {
    const jefatura = this.jefaturaRepository.create({
      nombre: createJefaturaDto.nombre,
    });

    if (createJefaturaDto.areaId) {
      const area = await this.areaRepository.findOne({
        where: { id: createJefaturaDto.areaId }
      });

      if (!area) {
        throw new NotFoundException(`Area con ID ${createJefaturaDto.areaId} no encontrada`);
      }

      jefatura.area = area;
    }

    return await this.jefaturaRepository.save(jefatura);
  }

  async findAll(): Promise<Jefatura[]> {
    return await this.jefaturaRepository.find({
      relations: ['area'],
    });
  }

  async findOne(id: number): Promise<Jefatura> {
    const jefatura = await this.jefaturaRepository.findOne({
      where: { id },
      relations: ['area'],
    });
    if (!jefatura) {
      throw new NotFoundException(`Jefatura with ID ${id} not found`);
    }
    return jefatura;
  }

  async update(id: number, updateJefaturaDto: UpdateJefaturaDto): Promise<Jefatura> {
    const jefatura = await this.findOne(id);

    if (updateJefaturaDto.nombre) {
      jefatura.nombre = updateJefaturaDto.nombre;
    }

    if (updateJefaturaDto.areaId) {
      const area = await this.areaRepository.findOne({
        where: { id: updateJefaturaDto.areaId }
      });

      if (!area) {
        throw new NotFoundException(`Area con ID ${updateJefaturaDto.areaId} no encontrada`);
      }

      jefatura.area = area;
    }

    return await this.jefaturaRepository.save(jefatura);
  }

  async remove(id: number): Promise<void> {
    const jefatura = await this.findOne(id);
    await this.jefaturaRepository.remove(jefatura);
  }
}
