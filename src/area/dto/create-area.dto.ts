import { IsString, IsNotEmpty, Length, IsNumber, IsOptional } from 'class-validator';

export class CreateAreaDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    nombre: string;

    @IsNumber()
    @IsOptional()
    usuarioId?: number;

    @IsNumber()
    @IsOptional()
    tipoAreaId?: number;
}