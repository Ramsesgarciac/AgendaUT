import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoAreaService } from './tipo-area.service';
import { TipoAreaController } from './tipo-area.controller';
import { TipoArea } from './entities/tipo-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoArea])],
  controllers: [TipoAreaController],
  providers: [TipoAreaService],
})
export class TipoAreaModule {}
