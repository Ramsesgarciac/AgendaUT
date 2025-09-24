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
} from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  create(@Body() createActividadeDto: CreateActividadeDto) {
    return this.actividadesService.create(createActividadeDto);
  }

  @Get()
  findAll() {
    return this.actividadesService.findAll();
  }

  @Get('area/:areaId')
  findByArea(@Param('areaId', ParseIntPipe) areaId: number) {
    return this.actividadesService.findByArea(areaId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.actividadesService.findByUser(userId);
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.remove(id);
  }

  // Endpoint adicional para crear manualmente una colección de comentarios
  @Post(':id/coleccion-comentarios')
  crearColeccionComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.crearColeccionComentarios(id);
  }

  // Endpoint de prueba para recordatorios (cuando implementes NotificationService)
  @Post(':id/test-reminder/:days')
  async testReminder(
    @Param('id', ParseIntPipe) id: number,
    @Param('days', ParseIntPipe) days: number,
  ) {
    // Validaciones adicionales
    if (days < 1 || days > 30) {
      throw new BadRequestException('Los días deben estar entre 1 y 30');
    }
    
    // Este endpoint lo implementaremos cuando tengas el NotificationService
    return { 
      message: `Test reminder endpoint - ID: ${id}, Days: ${days}`,
      note: 'Este endpoint se activará cuando implementes el NotificationService'
    };
  }
}