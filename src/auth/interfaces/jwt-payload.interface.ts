// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
    sub: number; // user id
    email: string;
    rol: string;
    iat?: number;
    exp?: number;
}