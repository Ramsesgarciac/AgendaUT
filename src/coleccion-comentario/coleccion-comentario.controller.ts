// src/coleccion-comentario/coleccion-comentario.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Put
} from '@nestjs/common';
import { ColeccionComentariosService } from './coleccion-comentario.service';
import { CreateColeccionComentarioDto } from './dto/create-coleccion-comentario.dto';
import { UpdateColeccionComentarioDto } from './dto/update-coleccion-comentario.dto';

@Controller('coleccion-comentario')
export class ColeccionComentariosController {
  constructor(
    private readonly coleccionComentariosService: ColeccionComentariosService
  ) {}

  // Crear una nueva colección de comentarios
  @Post()
  create(@Body() createColeccionComentarioDto: CreateColeccionComentarioDto) {
    return this.coleccionComentariosService.create(createColeccionComentarioDto);
  }

  // Obtener todas las colecciones
  @Get()
  findAll() {
    return this.coleccionComentariosService.findAll();
  }

  // Obtener colecciones por actividad
  @Get('actividad/:idActividad')
  findByActividad(@Param('idActividad') idActividad: string) {
    return this.coleccionComentariosService.findByActividad(+idActividad);
  }

  // Obtener una colección específica
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coleccionComentariosService.findOne(+id);
  }

  // Actualizar una colección
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateColeccionComentarioDto: UpdateColeccionComentarioDto
  ) {
    return this.coleccionComentariosService.update(+id, updateColeccionComentarioDto);
  }

  // Eliminar una colección
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coleccionComentariosService.remove(+id);
  }

  // Agregar comentarios a una colección
  @Put(':id/comentarios')
  agregarComentarios(
    @Param('id') id: string,
    @Body('idsComentarios') idsComentarios: number[]
  ) {
    return this.coleccionComentariosService.agregarComentarios(+id, idsComentarios);
  }

  // Quitar comentarios de una colección
  @Delete(':id/comentarios')
  quitarComentarios(
    @Param('id') id: string,
    @Body('idsComentarios') idsComentarios: number[]
  ) {
    return this.coleccionComentariosService.quitarComentarios(+id, idsComentarios);
  }
}