import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoAreaService } from './tipo-area.service';
import { CreateTipoAreaDto } from './dto/create-tipo-area.dto';
import { UpdateTipoAreaDto } from './dto/update-tipo-area.dto';

@Controller('tipo-area')
export class TipoAreaController {
  constructor(private readonly tipoAreaService: TipoAreaService) {}

  @Post()
  create(@Body() createTipoAreaDto: CreateTipoAreaDto) {
    return this.tipoAreaService.create(createTipoAreaDto);
  }

  @Get()
  findAll() {
    return this.tipoAreaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoAreaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoAreaDto: UpdateTipoAreaDto) {
    return this.tipoAreaService.update(+id, updateTipoAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoAreaService.remove(+id);
  }
}
