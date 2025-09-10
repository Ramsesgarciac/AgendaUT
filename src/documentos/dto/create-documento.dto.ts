import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';

export class CreateDocumentoDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    tipoDoc: string;

    @IsNumber()
    @IsNotEmpty()
    idActividades: number;
}
