// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
//DTO es data transfer object
export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string; //Aqui escribes tu email, unicamente email
    
    @IsString()
    @IsNotEmpty()
    @Length(6, 255)
    contraseña: string; //contraseña, luego se encriptara
}