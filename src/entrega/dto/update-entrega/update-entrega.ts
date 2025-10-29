import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregaDto } from '../create-entrega/create-entrega';

export class UpdateEntregaDto extends PartialType(CreateEntregaDto) {}
