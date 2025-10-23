import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JefaturaService } from './jefatura.service';
import { JefaturaController } from './jefatura.controller';
import { Jefatura } from './entities/jefatura.entity';
import { Area } from '../area/entities/area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jefatura, Area])],
  controllers: [JefaturaController],
  providers: [JefaturaService],
})
export class JefaturaModule {}
