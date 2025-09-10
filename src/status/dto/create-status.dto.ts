import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateStatusDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    nombre: string;
}