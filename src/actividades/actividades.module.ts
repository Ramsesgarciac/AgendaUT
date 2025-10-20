import { forwardRef, Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividades } from './entities/actividade.entity';
import { ColeccionComentarios } from '../coleccion-comentario/entities/coleccion-comentario.entity';
import { MailModule } from '../mail/mail.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Actividades, ColeccionComentarios]), // Esto es crucial
      forwardRef(() => MailModule)
    ],
  controllers: [ActividadesController],
  providers: [ActividadesService, NotificationService],
  exports:[ActividadesService]
})
export class ActividadesModule {}
