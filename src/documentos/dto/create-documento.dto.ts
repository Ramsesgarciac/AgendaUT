import { IsString, IsNotEmpty, Length, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentoDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    tipoDoc: string; // Ahora representa el tipo de documento (ej: "Oficio", "Memorándum", "Reporte")

    @IsNumber()
    @IsNotEmpty()
    idActividades: number;

    @IsNumber()
    @IsNotEmpty()
    entregaId: number;
}

// Nuevo DTO para manejar múltiples documentos
export class CreateDocumentosArrayDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDocumentoDto)
    documentos: CreateDocumentoDto[];

    // Campo opcional para cuando se envían archivos múltiples
    @IsOptional()
    archivos?: Express.Multer.File[];
}