// Indica que datos debera llevar el jwt
export interface JwtPayload {
    sub: number; // user id
    email: string; 
    rol: string;
    iat?: number;
    exp?: number;
}