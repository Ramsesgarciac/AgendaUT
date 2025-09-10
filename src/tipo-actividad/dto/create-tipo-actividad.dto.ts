import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateTipoActividadDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    nombre: string;
}