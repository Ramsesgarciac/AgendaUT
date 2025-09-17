// src/coleccion-comentarios/dto/create-coleccion-comentario.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateColeccionComentarioDto {
  @IsNumber()
  @IsNotEmpty()
  idActividad: number;
}