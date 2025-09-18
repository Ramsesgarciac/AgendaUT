// src/actividades/actividades.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findByArea(@Param('areaId') areaId: string) {
    return this.actividadesService.findByArea(+areaId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.actividadesService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actividadesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActividadeDto: UpdateActividadeDto) {
    return this.actividadesService.update(+id, updateActividadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actividadesService.remove(+id);
  }

  // Endpoint adicional para crear manualmente una colección de comentarios
  @Post(':id/coleccion-comentarios')
  crearColeccionComentarios(@Param('id') id: string) {
    return this.actividadesService.crearColeccionComentarios(+id);
  }
}