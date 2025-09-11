import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notas } from './entities/nota.entity';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Notas)
    private readonly notasRepository: Repository<Notas>
  ){}
    async create(createNotaDto: CreateNotaDto): Promise<Notas> {
    const notas = this.notasRepository.create({
      nombre: createNotaDto.nombre,
      nota: createNotaDto.nota,
      userCreate: { id: createNotaDto.idUserCreate },
      area: { id: createNotaDto.idArea },
      tiposActividad: [{ id: createNotaDto.tipoActividadId }] 
      //se pasa como array por que aqui es una relacion OneToMany
    });
    
    return this.notasRepository.save(notas);
  }

  async findAll(): Promise<Notas[]> {
    return this.notasRepository.find({
      relations: ['area', 'userCreate', 'tiposActividad']
    });
  }

  async findOne(id: number): Promise<Notas> {
    const nota = await this.notasRepository.findOne({
      where: {id},
      relations: ['area', 'userCreate', 'tiposActividad']
    });

    if (!nota) {
          throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
        }
    return nota;
  }

  async update(id: number, updateNotaDto: UpdateNotaDto):Promise<Notas> {
    const notas = await this.findOne(id);

    if(updateNotaDto.idArea) {
      notas.area = { id: updateNotaDto.idArea } as any;
    }

    if(updateNotaDto.idUserCreate){
      notas.userCreate = { id: updateNotaDto.idUserCreate } as any;
    }

    if(updateNotaDto.tipoActividadId){
      notas.tiposActividad = {id: updateNotaDto.tipoActividadId} as any;
    }

    Object.assign(notas, {
      nombre: updateNotaDto.nombre || notas.nombre,
      nota: updateNotaDto.nota || notas.nota,
    })
    return this.notasRepository.save(notas);
  }

  async remove(id: number): Promise<void> {
    const notas = await this.findOne(id);
    await this.notasRepository.remove(notas)
  }
}
