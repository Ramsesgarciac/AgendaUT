import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AreaModule } from './area/area.module';
import { TipoActividadModule } from './tipo-actividad/tipo-actividad.module';
import { StatusModule } from './status/status.module';
import { ActividadesModule } from './actividades/actividades.module';
import { DocumentosModule } from './documentos/documentos.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { NotasModule } from './notas/notas.module';
import { join } from 'path';
import { ColeccionComentarioModule } from './coleccion-comentario/coleccion-comentario.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { TipoAreaModule } from './tipo-area/tipo-area.module';
import { JefaturaModule } from './jefatura/jefatura.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    ActividadesModule,
    MailModule,
    UsuarioModule,
    AreaModule,
    TipoActividadModule,
    StatusModule,
    ActividadesModule,
    DocumentosModule,
    MailModule,
    ComentariosModule,
    NotasModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Asegúrate de importar ConfigModule
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [ConfigService], // Esta línea es crucial - especifica las dependencias
    }),
    ColeccionComentarioModule,
    AuthModule,
    TipoAreaModule,
    JefaturaModule
  ],
  controllers: [AppController],
  providers: [AppService, 
      {provide: APP_GUARD, useClass: JwtAuthGuard,}
    ],
})
export class AppModule {}