// src/coleccion-comentarios/dto/create-coleccion-comentario.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateColeccionComentarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}