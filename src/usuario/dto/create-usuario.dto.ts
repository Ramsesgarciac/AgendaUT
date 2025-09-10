import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    rol: string;

    @IsEmail()
    @IsNotEmpty()
    @Length(1, 100)
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 255)
    contraseña: string;
}