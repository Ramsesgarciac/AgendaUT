import { Injectable } from '@nestjs/common';
import { CreateTipoActividadDto } from './dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from './dto/update-tipo-actividad.dto';

@Injectable()
export class TipoActividadService {
  create(createTipoActividadDto: CreateTipoActividadDto) {
    return 'This action adds a new tipoActividad';
  }

  findAll() {
    return `This action returns all tipoActividad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoActividad`;
  }

  update(id: number, updateTipoActividadDto: UpdateTipoActividadDto) {
    return `This action updates a #${id} tipoActividad`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoActividad`;
  }
}
