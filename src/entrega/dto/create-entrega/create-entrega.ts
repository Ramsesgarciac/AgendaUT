import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEntregaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsOptional()
    documentoId?: number;
}
