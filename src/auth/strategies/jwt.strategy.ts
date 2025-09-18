// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsuarioService } from '../../usuario/usuario.service';
import { Usuario } from '../../usuario/entities/usuario.entity';
//el strategy es el que verifica 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //aqui se usa el header authorization 
            ignoreExpiration: false,  //si el token expira no se acepta
            secretOrKey: configService.get<string>('JWT_SECRET') || 'mi-clave-secreta-super-segura',  //aqui se verifica si la clave es real
        });
        
        console.log('JWT Strategy initialized with secret:', configService.get<string>('JWT_SECRET') || 'mi-clave-secreta-super-segura');
    }

    async validate(payload: JwtPayload): Promise<Usuario> {
        console.log('JWT Payload recibido:', payload);
        // 1.- extraemos el id del usuario del jwt 
        const { sub } = payload;
        
        if (!sub) {
            console.log('No se encontró sub en el payload');
            throw new UnauthorizedException('Token inválido - missing sub');
        }
        
        try {
            const usuario = await this.usuarioService.findOne(sub); // 2.- verificamos que el usuario aun existe en la bdd
            console.log('Usuario encontrado:', usuario.id, usuario.email);
            return usuario; // 3.- si existe permitimos el acceso
        } catch (error) {
            console.log('Error al buscar usuario:', error.message);
            throw new UnauthorizedException('Token inválido - user not found');
        }
    }
}