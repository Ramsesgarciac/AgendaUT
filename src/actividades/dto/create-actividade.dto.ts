import { 
    IsString, 
    IsNotEmpty, 
    Length, 
    IsDate, 
    IsNumber,
    IsDateString,
    IsISO8601
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

    @IsISO8601()  // Sin transform
    fechaLimite: string;  // Mantener como string

    @IsNumber()
    @IsNotEmpty()
    idArea: number;

    @IsNumber()
    @IsNotEmpty()
    idUserCreate: number;

    @IsNumber()
    @IsNotEmpty()
    statusId: number;
}