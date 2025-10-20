import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoAreaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
