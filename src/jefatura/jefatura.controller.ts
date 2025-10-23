import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JefaturaService } from './jefatura.service';
import { CreateJefaturaDto } from './dto/create-jefatura.dto';
import { UpdateJefaturaDto } from './dto/update-jefatura.dto';

@Controller('jefatura')
export class JefaturaController {
  constructor(private readonly jefaturaService: JefaturaService) {}

  @Post()
  create(@Body() createJefaturaDto: CreateJefaturaDto) {
    return this.jefaturaService.create(createJefaturaDto);
  }

  @Get()
  findAll() {
    return this.jefaturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jefaturaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJefaturaDto: UpdateJefaturaDto) {
    return this.jefaturaService.update(+id, updateJefaturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jefaturaService.remove(+id);
  }
}
