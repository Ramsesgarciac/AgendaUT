import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
    @IsNumber()
    @IsOptional()
    idColeccion?: number;
}