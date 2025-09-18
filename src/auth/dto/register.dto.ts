import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class RegisterDto{
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