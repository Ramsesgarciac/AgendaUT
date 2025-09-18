// src/auth/guards/jwt-auth.guard.ts (versión con debugging)
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Verificar si la ruta está marcada como pública
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            console.log('Ruta pública, permitiendo acceso');
            return true;
        }

        console.log('Ruta protegida, validando JWT');
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        console.log('JWT Guard - Error:', err);
        console.log('JWT Guard - User:', user);
        console.log('JWT Guard - Info:', info);
        
        if (err || !user) {
            throw err || new UnauthorizedException('Token inválido o expirado');
        }
        return user;
    }
}