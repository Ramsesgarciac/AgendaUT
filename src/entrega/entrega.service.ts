import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrega } from './entities/entrega/entrega.entity';
import { CreateEntregaDto } from './dto/create-entrega/create-entrega';
import { UpdateEntregaDto } from './dto/update-entrega/update-entrega';
import { Documentos } from '../documentos/entities/documento.entity';

@Injectable()
export class EntregaService {
  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    @InjectRepository(Documentos)
    private readonly documentoRepository: Repository<Documentos>
  ) {}

  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    const entrega = this.entregaRepository.create({
      nombre: createEntregaDto.nombre,
    });

    if (createEntregaDto.documentoId) {
      const documento = await this.documentoRepository.findOne({
        where: { id: createEntregaDto.documentoId }
      });

      if (!documento) {
        throw new NotFoundException(`Documento con ID ${createEntregaDto.documentoId} no encontrado`);
      }

      entrega.documento = documento;
    }

    return await this.entregaRepository.save(entrega);
  }

  async findAll(): Promise<Entrega[]> {
    return await this.entregaRepository.find({
      relations: ['documento'],
    });
  }

  async findOne(id: number): Promise<Entrega> {
    const entrega = await this.entregaRepository.findOne({
      where: { id },
      relations: ['documento'],
    });
    if (!entrega) {
      throw new NotFoundException(`Entrega with ID ${id} not found`);
    }
    return entrega;
  }

  async update(id: number, updateEntregaDto: UpdateEntregaDto): Promise<Entrega> {
    const entrega = await this.findOne(id);

    if (updateEntregaDto.nombre) {
      entrega.nombre = updateEntregaDto.nombre;
    }

    if (updateEntregaDto.documentoId) {
      const documento = await this.documentoRepository.findOne({
        where: { id: updateEntregaDto.documentoId }
      });

      if (!documento) {
        throw new NotFoundException(`Documento con ID ${updateEntregaDto.documentoId} no encontrado`);
      }

      entrega.documento = documento;
    }

    return await this.entregaRepository.save(entrega);
  }

  async remove(id: number): Promise<void> {
    const entrega = await this.findOne(id);
    await this.entregaRepository.remove(entrega);
  }
}
