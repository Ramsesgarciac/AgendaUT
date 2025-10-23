import { PartialType } from '@nestjs/mapped-types';
import { CreateJefaturaDto } from './create-jefatura.dto';

export class UpdateJefaturaDto extends PartialType(CreateJefaturaDto) {}
