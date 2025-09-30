import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoActividadDto } from './dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from './dto/update-tipo-actividad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoActividad } from './entities/tipo-actividad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoActividadService {
  constructor(
    @InjectRepository(TipoActividad)
    private readonly tipoActividadRepository: Repository<TipoActividad>,
  ){}
  async create(createTipoActividadDto: CreateTipoActividadDto): Promise<TipoActividad> {
    const tipoact = this.tipoActividadRepository.create({
      nombre: createTipoActividadDto.nombre,
    })
    return this.tipoActividadRepository.save(tipoact);
  }

  async findAll():Promise <TipoActividad[]> {
    return this.tipoActividadRepository.find({
      relations: ['notas']
    });
  }

  async findOne(id: number):Promise<TipoActividad> {
    const tipoAct = await this.tipoActividadRepository.findOne({
      where: {id},
      relations: ['notas']
    })

    if (!tipoAct) {
          throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
        }
    
    return tipoAct;
  }

  async update(id: number, updateTipoActividadDto: UpdateTipoActividadDto): Promise<TipoActividad> {
    const tipoAct = await this.findOne(id);

    Object.assign(tipoAct, {
      nombre: updateTipoActividadDto.nombre || tipoAct.nombre
    })
    return this.tipoActividadRepository.save(tipoAct);
  }

  async remove(id: number): Promise<void> {
    const tipoAct = await this.findOne(id);
    await this.tipoActividadRepository.remove(tipoAct)
  }
}
