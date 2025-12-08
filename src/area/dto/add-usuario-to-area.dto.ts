import { IsNumber } from 'class-validator';

export class AddUsuarioToAreaDto {
  @IsNumber()
  usuarioId: number;
}