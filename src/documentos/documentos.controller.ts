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
  Res,
  Query,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  create(
    @Body() createDocumentosDto: CreateDocumentoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.documentosService.create(createDocumentosDto, file);
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

      // Configurar headers para la descarga
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
      txt: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    };
    
    return mimeTypes[tipoDoc.toLowerCase()] || 'application/octet-stream';
  }

  @Get(':id/ver')
async verArchivo(@Param('id') id: number, @Res() res: Response) {
  try {
    const buffer = await this.documentosService.getFileBuffer(id);
    const documento = await this.documentosService.findOne(id);

    if (!buffer) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Determinar el Content-Type basado en la extensión
    let contentType = 'application/octet-stream';
    if (documento.tipoDoc.toLowerCase() === 'pdf') {
      contentType = 'application/pdf';
    } else if (documento.tipoDoc.toLowerCase().includes('image')) {
      contentType = `image/${documento.tipoDoc.split('/').pop()}`;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    throw new NotFoundException('Archivo no encontrado');
  }
}
}