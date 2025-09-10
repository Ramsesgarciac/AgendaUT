import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoActividadService } from './tipo-actividad.service';
import { CreateTipoActividadDto } from './dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from './dto/update-tipo-actividad.dto';

@Controller('tipo-actividad')
export class TipoActividadController {
  constructor(private readonly tipoActividadService: TipoActividadService) {}

  @Post()
  create(@Body() createTipoActividadDto: CreateTipoActividadDto) {
    return this.tipoActividadService.create(createTipoActividadDto);
  }

  @Get()
  findAll() {
    return this.tipoActividadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoActividadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoActividadDto: UpdateTipoActividadDto) {
    return this.tipoActividadService.update(+id, updateTipoActividadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoActividadService.remove(+id);
  }
}
