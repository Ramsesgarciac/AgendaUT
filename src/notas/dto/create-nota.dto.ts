import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';

export class CreateNotaDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    nota: string;

    @IsNumber()
    @IsNotEmpty()
    idUserCreate: number;

    @IsNumber()
    @IsNotEmpty()
    idArea: number;

    @IsNumber()
    @IsNotEmpty()
    tipoActividadId: number;
}