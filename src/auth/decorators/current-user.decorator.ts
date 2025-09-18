// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '../../usuario/entities/usuario.entity';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Usuario => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);