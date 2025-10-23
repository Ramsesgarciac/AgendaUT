import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateJefaturaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsOptional()
  areaId?: number;
}
