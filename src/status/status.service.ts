import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ){}

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const status = this.statusRepository.create({
      nombre:createStatusDto.nombre
    })
    return this.statusRepository.save(status)
  }

  async findAll():Promise<Status[]> {
    return this.statusRepository.find()
  }

  async findOne(id: number): Promise<Status> {
    const status = await this.statusRepository.findOne({
      where: {id},
    });

    if(!status){
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return status;
  }

  async update(id: number, updateStatusDto: UpdateStatusDto): Promise<Status> {
    const status = await this.findOne(id);

    Object.assign(status, {
      nombre: updateStatusDto.nombre || status.nombre
    })

    return this.statusRepository.save(status);
  }

  async remove(id: number): Promise<void> {
    const status = await this.findOne(id);
    await this.statusRepository.remove(status);
  }
}
