// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Usuario } from '../usuario/entities/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        try {
            const usuario = await this.usuarioService.create(registerDto);
            const { contraseña, ...result } = usuario;
            
            // Generar token JWT
            const payload: JwtPayload = {
                sub: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
            };

            return {
                message: 'Usuario registrado exitosamente',
                usuario: result,
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new ConflictException('Error al registrar usuario');
        }
    }

    async login(loginDto: LoginDto) {
        const { email, contraseña } = loginDto;

        // Buscar usuario por email
        const usuario = await this.validateUser(email, contraseña);

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar token JWT
        const payload: JwtPayload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
        };

        const { contraseña: _, ...result } = usuario;

        return {
            message: 'Login exitoso',
            usuario: result,
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, contraseña: string): Promise<Usuario | null> {
        try {
            // Necesitamos crear un método findByEmail en el UsuarioService
            const usuario = await this.usuarioService.findByEmail(email);
            
            if (usuario && await bcrypt.compare(contraseña, usuario.contraseña)) {
                return usuario;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async getProfile(usuario: Usuario) {
        const { contraseña, ...result } = usuario;
        return {
            message: 'Perfil obtenido exitosamente',
            usuario: result,
        };
    }
}