import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateComentarioDto {
    @IsString()
    @IsNotEmpty()
    contenido: string;

    @IsNumber()
    @IsNotEmpty()
    idActividad: number;

    @IsNumber()
    @IsNotEmpty()
    idUsuario: number;

    @IsNumber()
    @IsOptional()  // Esta propiedad es opcional
    idColeccion?: number;
}