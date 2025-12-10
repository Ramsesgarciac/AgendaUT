// src/actividades/actividades.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) { }

  @Post()
  create(@Body() createActividadeDto: CreateActividadeDto) {
    return this.actividadesService.create(createActividadeDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    // Validar que los parámetros sean válidos
    if (page < 1) {
      throw new BadRequestException('El número de página debe ser mayor a 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('El límite debe estar entre 1 y 100');
    }

    return this.actividadesService.findAll(page, limit);
  }

  @Get('area/:areaId')
  findByArea(
    @Param('areaId', ParseIntPipe) areaId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    // Validar que los parámetros sean válidos
    if (page < 1) {
      throw new BadRequestException('El número de página debe ser mayor a 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('El límite debe estar entre 1 y 100');
    }

    return this.actividadesService.findByArea(areaId, page, limit);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    // Validar que los parámetros sean válidos
    if (page < 1) {
      throw new BadRequestException('El número de página debe ser mayor a 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('El límite debe estar entre 1 y 100');
    }

    return this.actividadesService.findByUser(userId, page, limit);
  }

  // Endpoint de prueba de conexión de mail
  @Get('test-mail-connection')
  async testMailConnection() {
    // Necesitarás inyectar MailService aquí cuando lo implementes
    return { message: 'Test endpoint para verificar conexión SMTP' };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActividadeDto: UpdateActividadeDto
  ) {
    return this.actividadesService.update(id, updateActividadeDto);
  }

  @Patch(':id/status/:statusId')
  cambiarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('statusId', ParseIntPipe) statusId: number
  ) {
    return this.actividadesService.cambiarStatus(id, statusId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.remove(id);
  }

  // Endpoint adicional para crear manualmente una colección de comentarios
  @Post(':id/coleccion-comentarios')
  crearColeccionComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.crearColeccionComentarios(id);
  }

  // Endpoint de prueba para recordatorios
  @Post(':id/test-reminder/:days')
  async testReminder(
    @Param('id', ParseIntPipe) id: number,
    @Param('days', ParseIntPipe) days: number,
  ) {
    // Validaciones adicionales
    if (days < 1 || days > 30) {
      throw new BadRequestException('Los días deben estar entre 1 y 30');
    }

    return this.actividadesService.enviarRecordatorioManual(id, days);
  }
}