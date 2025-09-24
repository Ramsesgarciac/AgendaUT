// src/mail/mail.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { ActividadesModule } from '../actividades/actividades.module';

@Module({
  imports: [
    ConfigModule, 
    forwardRef(() => ActividadesModule)
],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}