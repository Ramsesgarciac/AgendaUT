// src/actividades/dto/create-actividade.dto.ts
import {
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  IsDateString,
  IsISO8601,
  IsOptional,
  IsBoolean
} from 'class-validator';

export class CreateActividadeDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  asunto: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  instanciaReceptora: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  instanciaEmisora: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  tipoActividad: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsISO8601()
  fechaLimite: string;

  @IsNumber()
  @IsNotEmpty()
  idArea: number;

  @IsNumber()
  @IsNotEmpty()
  idUserCreate: number;

  @IsNumber()
  @IsNotEmpty()
  statusId: number;

  // Nueva propiedad opcional para crear colección de comentarios
  @IsBoolean()
  @IsOptional()
  crearColeccionComentarios?: boolean = true; // Por defecto será true
}