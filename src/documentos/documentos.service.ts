// src/modules/documentos/documentos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documentos } from './entities/documento.entity';
import { CreateDocumentoDto, CreateDocumentosArrayDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documentos)
    private readonly documentosRepository: Repository<Documentos>,
  ) {}

  // Método original para crear un solo documento
  async create(
    createDocumentosDto: CreateDocumentoDto,
    file?: Express.Multer.File,
  ): Promise<Documentos> {
    const documento = new Documentos();
    documento.nombre = createDocumentosDto.nombre;
    documento.tipoDoc = createDocumentosDto.tipoDoc;
    documento.actividad = { id: createDocumentosDto.idActividades } as any;
    documento.archivo = file ? file.buffer : null;

    return this.documentosRepository.save(documento);
  }

  // Nuevo método para crear múltiples documentos
  async createMultiple(
    createDocumentosArrayDto: CreateDocumentosArrayDto,
    files?: Express.Multer.File[],
  ): Promise<Documentos[]> {
    const documentos: Documentos[] = [];

    for (let i = 0; i < createDocumentosArrayDto.documentos.length; i++) {
      const dto = createDocumentosArrayDto.documentos[i];
      const file = files && files[i] ? files[i] : null;

      const documento = new Documentos();
      documento.nombre = dto.nombre;
      documento.tipoDoc = dto.tipoDoc;
      documento.actividad = { id: dto.idActividades } as any;
      documento.archivo = file ? file.buffer : null;

      documentos.push(documento);
    }

    return this.documentosRepository.save(documentos);
  }

  // Método alternativo que acepta un array directamente
  async createFromArray(
    documentosData: CreateDocumentoDto[],
    files?: Express.Multer.File[],
  ): Promise<Documentos[]> {
    const documentos: Documentos[] = [];

    for (let i = 0; i < documentosData.length; i++) {
      const dto = documentosData[i];
      const file = files && files[i] ? files[i] : null;

      const documento = new Documentos();
      documento.nombre = dto.nombre; // Nombre personalizado, independiente del archivo
      documento.tipoDoc = dto.tipoDoc; // Tipo de documento (ej: "Oficio", "Memorándum")
      documento.actividad = { id: dto.idActividades } as any;
      documento.archivo = file ? file.buffer : null;

      documentos.push(documento);
    }

    return this.documentosRepository.save(documentos);
  }

  async findAll(): Promise<Documentos[]> {
    return this.documentosRepository.find({
      relations: ['actividad'],
      select: {
        id: true,
        nombre: true,
        tipoDoc: true,
        actividad: {
          id: true,
          asunto: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Documentos> {
    const documento = await this.documentosRepository.findOne({
      where: { id },
      relations: ['actividad'],
    });

    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }

    return documento;
  }

  async findByActividad(actividadId: number): Promise<Documentos[]> {
    return this.documentosRepository.find({
      where: { actividad: { id: actividadId } },
      relations: ['actividad'],
      select: {
        id: true,
        nombre: true,
        tipoDoc: true,
        actividad: {
          id: true,
          asunto: true,
        },
      },
    });
  }

  async update(
    id: number,
    updateDocumentosDto: UpdateDocumentoDto,
  ): Promise<Documentos> {
    const documento = await this.findOne(id);
        
    if (updateDocumentosDto.nombre) {
      documento.nombre = updateDocumentosDto.nombre;
    }
        
    if (updateDocumentosDto.tipoDoc) {
      documento.tipoDoc = updateDocumentosDto.tipoDoc;
    }
        
    if (updateDocumentosDto.idActividades) {
      documento.actividad = { id: updateDocumentosDto.idActividades } as any;
    }

    return this.documentosRepository.save(documento);
  }

  async updateWithFile(
    id: number,
    updateDocumentosDto: UpdateDocumentoDto,
    file?: Express.Multer.File,
  ): Promise<Documentos> {
    const documento = await this.update(id, updateDocumentosDto);
        
    if (file) {
      documento.archivo = file.buffer;
      return this.documentosRepository.save(documento);
    }
        
    return documento;
  }

  async remove(id: number): Promise<void> {
    const documento = await this.findOne(id);
    await this.documentosRepository.remove(documento);
  }

  async getFileBuffer(id: number): Promise<Buffer | null> {
    const documento = await this.documentosRepository.findOne({
      where: { id },
      select: ['id', 'archivo', 'nombre', 'tipoDoc'],
    });

    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }

    return documento.archivo;
  }
}