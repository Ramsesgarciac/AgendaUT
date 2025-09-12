import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  Query,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto, CreateDocumentosArrayDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  // Endpoint original para crear un solo documento
  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  create(
    @Body() createDocumentosDto: CreateDocumentoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.documentosService.create(createDocumentosDto, file);
  }

  // Nuevo endpoint simple para crear múltiples documentos con archivos múltiples
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('archivos', 10)) // Máximo 10 archivos
  createMultiple(
    @Body('documentos') documentosData: string | CreateDocumentoDto[],
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // Si viene como string (desde form-data), parsearlo
    let parsedDocumentos: CreateDocumentoDto[];
    if (typeof documentosData === 'string') {
      try {
        parsedDocumentos = JSON.parse(documentosData);
      } catch (error) {
        throw new Error('El formato de documentos no es válido. Debe ser un JSON array.');
      }
    } else {
      parsedDocumentos = documentosData;
    }

    return this.documentosService.createFromArray(parsedDocumentos, files);
  }

  // Endpoint alternativo para crear múltiples documentos desde array directo
  @Post('batch')
  @UseInterceptors(FilesInterceptor('archivos', 10)) // Máximo 10 archivos
  createBatch(
    @Body('documentos') documentosData: CreateDocumentoDto[],
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.documentosService.createFromArray(documentosData, files);
  }

  @Get()
  findAll(@Query('actividadId') actividadId?: string) {
    if (actividadId) {
      return this.documentosService.findByActividad(+actividadId);
    }
    return this.documentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOne(id);
  }

  @Get(':id/download')
  async download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const documento = await this.documentosService.findOne(id);
      const fileBuffer = await this.documentosService.getFileBuffer(id);
      
      if (!fileBuffer) {
        return res.status(HttpStatus.NOT_FOUND).json({ 
          message: 'Archivo no encontrado o no disponible' 
        });
      }

      res.setHeader('Content-Type', this.getMimeType(documento.tipoDoc));
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${documento.nombre}.${documento.tipoDoc}"`,
      );
      res.setHeader('Content-Length', fileBuffer.length);
      
      return res.send(fileBuffer);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al descargar el archivo',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('archivo'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentosDto: UpdateDocumentoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      return this.documentosService.updateWithFile(id, updateDocumentosDto, file);
    }
    return this.documentosService.update(id, updateDocumentosDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.remove(id);
  }

  private getMimeType(tipoDoc: string): string {
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      zip: 'application/zip',
    };
    
    return mimeTypes[tipoDoc.toLowerCase()] || 'application/octet-stream';
  }

  // Método mejorado para detectar MIME type desde el buffer
  private detectMimeTypeFromBuffer(buffer: Buffer): string {
    if (buffer.length < 4) {
      return 'application/octet-stream';
    }

    // Detectar tipos de archivo comunes por sus magic numbers
    const firstBytes = buffer.readUInt32BE(0);
    const firstTwoBytes = buffer.readUInt16BE(0);

    // PDF: %PDF
    if (firstBytes === 0x25504446) {
      return 'application/pdf';
    }
    
    // PNG: \x89PNG
    if (firstBytes === 0x89504E47) {
      return 'image/png';
    }
    
    // JPEG: \xFF\xD8\xFF
    if (firstTwoBytes === 0xFFD8) {
      return 'image/jpeg';
    }
    
    // GIF: GIF87a o GIF89a
    if (firstBytes === 0x47494638) {
      return 'image/gif';
    }
    
    // ZIP-based formats (DOCX, XLSX, PPTX, etc.): PK\x03\x04
    if (firstBytes === 0x504B0304) {
      // Intentar detectar el tipo específico de Office Open XML
      if (buffer.length > 30) {
        // Buscar patrones específicos en el ZIP para identificar el tipo
        const bufferString = buffer.toString('utf8', 0, 100);
        
        if (bufferString.includes('word/')) {
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
        if (bufferString.includes('xl/') || bufferString.includes('worksheets/')) {
          return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
        if (bufferString.includes('ppt/')) {
          return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        }
      }
      return 'application/zip';
    }
    
    // Microsoft Office formats antiguos (DOC, XLS, PPT)
    if (firstBytes === 0xD0CF11E0) {
      // Detectar tipo específico basado en estructuras internas
      if (buffer.length > 520) {
        const subheader = buffer.readUInt16BE(512);
        if (subheader === 0xA5EC) {
          return 'application/msword';
        }
        if (subheader === 0x809) {
          return 'application/vnd.ms-excel';
        }
        if (subheader === 0x6E1) {
          return 'application/vnd.ms-powerpoint';
        }
      }
      return 'application/msword'; // Por defecto para formatos OLE
    }
    
    // Texto plano (verificar si es texto legible)
    if (this.isLikelyText(buffer)) {
      return 'text/plain';
    }
    
    // Si no se puede detectar, usar tipo genérico
    return 'application/octet-stream';
  }

  // Método auxiliar para detectar texto plano
  private isLikelyText(buffer: Buffer): boolean {
    // Verificar si la mayoría de los bytes son caracteres ASCII imprimibles
    const sampleSize = Math.min(buffer.length, 1000);
    let printableCount = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      const byte = buffer[i];
      // Caracteres ASCII imprimibles (32-126) más tab, newline, carriage return
      if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
        printableCount++;
      }
    }
    
    return (printableCount / sampleSize) > 0.9; // 90% de caracteres imprimibles
  }

  @Get(':id/ver')
  async verArchivo(@Param('id') id: number, @Res() res: Response) {
    try {
      const documento = await this.documentosService.findOne(id);
      const buffer = await this.documentosService.getFileBuffer(id);

      if (!buffer) {
        throw new NotFoundException('Archivo no encontrado');
      }

      // Detectar Content-Type desde el archivo real
      let contentType = this.detectMimeTypeFromBuffer(buffer);
      
      // Para documentos de Office, forzar la visualización en el navegador
      // en lugar de la descarga
      const contentDisposition = this.shouldDisplayInline(contentType) 
        ? 'inline' 
        : 'attachment';
      
      const filename = `${documento.nombre}.${documento.tipoDoc}`;

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Content-Disposition', `${contentDisposition}; filename="${filename}"`);
      
      return res.send(buffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Archivo no encontrado');
    }
  }

  // Determinar si el archivo debe mostrarse inline o forzar descarga
  private shouldDisplayInline(contentType: string): boolean {
    const inlineTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    return inlineTypes.includes(contentType);
  }
}