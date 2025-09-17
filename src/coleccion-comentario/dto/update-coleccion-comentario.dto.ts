import { PartialType } from '@nestjs/mapped-types';
import { CreateColeccionComentarioDto } from './create-coleccion-comentario.dto';

export class UpdateColeccionComentarioDto extends PartialType(CreateColeccionComentarioDto) {}
