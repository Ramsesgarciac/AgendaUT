import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class RegisterDto{
    @IsString()
        @IsNotEmpty()
        @Length(1, 50)
        rol: string; //indica tu rol, si erees rector o jefe de area 
    
        @IsEmail()
        @IsNotEmpty()
        @Length(1, 100)
        email: string; //indica tu email, tiene que ser real
    
        @IsString()
        @IsNotEmpty()
        @Length(6, 255)
        contraseña: string;// contraseña
}