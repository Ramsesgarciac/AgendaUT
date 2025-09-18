// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '../../usuario/entities/usuario.entity';
// Este current lo que hace es pedir saber que usuario hace la peticion
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Usuario => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },

    //una vez que sabe que usuario hace la peticion extrae su informacion para el jwt
);