// src/modules/documentos/documentos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documentos } from './entities/documento.entity';
import { CreateDocumentoDto, CreateDocumentosArrayDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Entrega } from '../entrega/entities/entrega/entrega.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documentos)
    private readonly documentosRepository: Repository<Documentos>,
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Método original para crear un solo documento
  async create(
    createDocumentosDto: CreateDocumentoDto,
    file?: Express.Multer.File,
  ): Promise<Documentos> {
    // Validar que la entrega existe
    const entrega = await this.entregaRepository.findOne({
      where: { id: createDocumentosDto.entregaId }
    });

    if (!entrega) {
      throw new NotFoundException(`Entrega con ID ${createDocumentosDto.entregaId} no encontrada`);
    }

    // Validar que el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id: createDocumentosDto.usuarioId }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createDocumentosDto.usuarioId} no encontrado`);
    }

    const documento = new Documentos();
    documento.nombre = createDocumentosDto.nombre;
    documento.tipoDoc = createDocumentosDto.tipoDoc;
    documento.isAcuce = createDocumentosDto.isAcuce ?? false;
    documento.actividad = { id: createDocumentosDto.idActividades } as any;
    documento.entrega = { id: createDocumentosDto.entregaId } as any;
    documento.usuario = { id: createDocumentosDto.usuarioId } as any;
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

      // Validar que la entrega existe
      const entrega = await this.entregaRepository.findOne({
        where: { id: dto.entregaId }
      });

      if (!entrega) {
        throw new NotFoundException(`Entrega con ID ${dto.entregaId} no encontrada`);
      }

      // Validar que el usuario existe
      const usuario = await this.usuarioRepository.findOne({
        where: { id: dto.usuarioId }
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${dto.usuarioId} no encontrado`);
      }

      const documento = new Documentos();
      documento.nombre = dto.nombre;
      documento.tipoDoc = dto.tipoDoc;
      documento.isAcuce = dto.isAcuce ?? false;
      documento.actividad = { id: dto.idActividades } as any;
      documento.entrega = { id: dto.entregaId } as any;
      documento.usuario = { id: dto.usuarioId } as any;
      documento.archivo = file ? file.buffer : null;

      documentos.push(documento);
    }

    return this.documentosRepository.save(documentos);
  }

  // Método alternativo que acepta un array directamente
  // REEMPLAZA EL MÉTODO createFromArray en documentos.service.ts

// REEMPLAZA COMPLETO el método createFromArray en documentos.service.ts

async createFromArray(
  documentosData: CreateDocumentoDto[],
  files?: Express.Multer.File[],
): Promise<Documentos[]> {
  const documentos: Documentos[] = [];

  for (let i = 0; i < documentosData.length; i++) {
    const dto = documentosData[i];
    const file = files && files[i] ? files[i] : null;

    console.log('🔍 Procesando documento:', dto);
    console.log('📦 Es acuse:', dto.isAcuce);
    console.log('📦 EntregaId:', dto.entregaId);

    try {
      // 🔥 SOLO validar entrega si NO es un acuse Y si entregaId está presente
      if (!dto.isAcuce && dto.entregaId) {
        console.log('✅ Validando entrega:', dto.entregaId);
        const entrega = await this.entregaRepository.findOne({
          where: { id: dto.entregaId }
        });

        if (!entrega) {
          throw new NotFoundException(`Entrega con ID ${dto.entregaId} no encontrada`);
        }
      }

      // Validar que el usuario existe
      console.log('✅ Validando usuario:', dto.usuarioId);
      const usuario = await this.usuarioRepository.findOne({
        where: { id: dto.usuarioId }
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${dto.usuarioId} no encontrado`);
      }

      const documento = new Documentos();
      documento.nombre = dto.nombre;
      documento.tipoDoc = dto.tipoDoc;
      documento.isAcuce = dto.isAcuce ?? false;
      documento.actividad = { id: dto.idActividades } as any;
      
      // 🔥 Solo asignar entrega si existe
      if (dto.entregaId) {
        console.log('✅ Asignando entrega al documento:', dto.entregaId);
        documento.entrega = { id: dto.entregaId } as any;
      } else {
        console.log('⚠️ Sin entregaId, dejando null');
        documento.entrega = null;
      }
      
      documento.usuario = { id: dto.usuarioId } as any;
      
      if (file) {
        console.log('✅ Archivo adjunto:', file.originalname, file.size, 'bytes');
        documento.archivo = file.buffer;
      }

      documentos.push(documento);
      console.log('✅ Documento preparado correctamente');
      
    } catch (error) {
      console.error('❌ Error procesando documento:', error);
      throw error;
    }
  }

  console.log('💾 Guardando', documentos.length, 'documentos en BD...');
  const result = await this.documentosRepository.save(documentos);
  console.log('✅ Documentos guardados exitosamente');
  return result;
}

  async findAll(): Promise<Documentos[]> {
    return this.documentosRepository.find({
      relations: ['actividad', 'usuario'],
      select: {
        id: true,
        nombre: true,
        tipoDoc: true,
        usuario: {
          id: true,
        },
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
      relations: ['actividad', 'usuario'],
      select: {
        id: true,
        nombre: true,
        tipoDoc: true,
        usuario: {
          id: true,
        },
        actividad: {
          id: true,
          asunto: true,
        },
      },
    });
  }

  async findByUsuario(usuarioId: number): Promise<Documentos[]> {
    return this.documentosRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
      select: {
        id: true,
        nombre: true,
        tipoDoc: true,
        usuario: {
          id: true,
          email: true,
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

    if (updateDocumentosDto.entregaId) {
      // Validar que la entrega existe
      const entrega = await this.entregaRepository.findOne({
        where: { id: updateDocumentosDto.entregaId }
      });

      if (!entrega) {
        throw new NotFoundException(`Entrega con ID ${updateDocumentosDto.entregaId} no encontrada`);
      }

      documento.entrega = { id: updateDocumentosDto.entregaId } as any;
    }

    if (updateDocumentosDto.usuarioId) {
      // Validar que el usuario existe
      const usuario = await this.usuarioRepository.findOne({
        where: { id: updateDocumentosDto.usuarioId }
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${updateDocumentosDto.usuarioId} no encontrado`);
      }

      documento.usuario = { id: updateDocumentosDto.usuarioId } as any;
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

  async getFileForViewing(id: number): Promise<{ buffer: Buffer; nombre: string; tipoDoc: string }> {
    const documento = await this.documentosRepository.findOne({
      where: { id },
      select: ['id', 'archivo', 'nombre', 'tipoDoc'],
    });

    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }

    if (!documento.archivo) {
      throw new NotFoundException(`Archivo no encontrado para el documento con ID ${id}`);
    }

    return {
      buffer: documento.archivo,
      nombre: documento.nombre,
      tipoDoc: documento.tipoDoc,
    };
  }
}