import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoArea } from './entities/tipo-area.entity';
import { CreateTipoAreaDto } from './dto/create-tipo-area.dto';
import { UpdateTipoAreaDto } from './dto/update-tipo-area.dto';

@Injectable()
export class TipoAreaService {
  constructor(
    @InjectRepository(TipoArea)
    private readonly tipoAreaRepository: Repository<TipoArea>,
  ) {}

  async create(createTipoAreaDto: CreateTipoAreaDto): Promise<TipoArea> {
    const tipoArea = this.tipoAreaRepository.create(createTipoAreaDto);
    return await this.tipoAreaRepository.save(tipoArea);
  }

  async findAll(): Promise<TipoArea[]> {
    return await this.tipoAreaRepository.find({
      relations: ['areas'],
    });
  }

  async findOne(id: number): Promise<TipoArea> {
    const tipoArea = await this.tipoAreaRepository.findOne({
      where: { id },
      relations: ['areas'],
    });
    if (!tipoArea) {
      throw new NotFoundException(`TipoArea with ID ${id} not found`);
    }
    return tipoArea;
  }

  async update(id: number, updateTipoAreaDto: UpdateTipoAreaDto): Promise<TipoArea> {
    const tipoArea = await this.findOne(id);
    Object.assign(tipoArea, updateTipoAreaDto);
    return await this.tipoAreaRepository.save(tipoArea);
  }

  async remove(id: number): Promise<void> {
    const tipoArea = await this.findOne(id);
    await this.tipoAreaRepository.remove(tipoArea);
  }
}
