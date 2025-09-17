// src/coleccion-comentarios/coleccion-comentarios.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ColeccionComentariosService } from './coleccion-comentario.service';
import { CreateColeccionComentarioDto } from './dto/create-coleccion-comentario.dto';

@Controller('colecciones-comentarios')
export class ColeccionComentariosController {
  constructor(private readonly coleccionService: ColeccionComentariosService) {}

  @Post()
  create(@Body() createDto: CreateColeccionComentarioDto) {
    return this.coleccionService.create(createDto);
  }

  @Get()
  findAll() {
    return this.coleccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coleccionService.findOne(+id);
  }

  @Patch(':id/agregar-comentarios')
  agregarComentarios(
    @Param('id') id: string,
    @Body() body: { comentariosIds: number[] }
  ) {
    return this.coleccionService.agregarComentarios(+id, body.comentariosIds);
  }

  @Patch(':id/remover-comentarios')
  removerComentarios(
    @Param('id') id: string,
    @Body() body: { comentariosIds: number[] }
  ) {
    return this.coleccionService.removerComentarios(+id, body.comentariosIds);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coleccionService.delete(+id);
  }
}