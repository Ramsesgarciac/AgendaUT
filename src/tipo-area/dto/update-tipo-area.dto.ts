import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoAreaDto } from './create-tipo-area.dto';

export class UpdateTipoAreaDto extends PartialType(CreateTipoAreaDto) {}
