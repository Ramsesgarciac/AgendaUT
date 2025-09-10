import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

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
}