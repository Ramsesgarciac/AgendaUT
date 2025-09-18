// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsuarioService } from '../../usuario/usuario.service';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'mi-clave-secreta-super-segura',
        });
        
        console.log('JWT Strategy initialized with secret:', configService.get<string>('JWT_SECRET') || 'mi-clave-secreta-super-segura');
    }

    async validate(payload: JwtPayload): Promise<Usuario> {
        console.log('JWT Payload recibido:', payload);
        
        const { sub } = payload;
        
        if (!sub) {
            console.log('No se encontró sub en el payload');
            throw new UnauthorizedException('Token inválido - missing sub');
        }
        
        try {
            const usuario = await this.usuarioService.findOne(sub);
            console.log('Usuario encontrado:', usuario.id, usuario.email);
            return usuario;
        } catch (error) {
            console.log('Error al buscar usuario:', error.message);
            throw new UnauthorizedException('Token inválido - user not found');
        }
    }
}