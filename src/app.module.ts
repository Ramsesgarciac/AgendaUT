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

@Module({
  imports: [
    UsuarioModule, AreaModule, TipoActividadModule, StatusModule, ActividadesModule, DocumentosModule, ComentariosModule, NotasModule,
    TypeOrmModule.forRoot({
      "type":"mysql",
      "host":"localhost",
      "port": 3306,
      "username":"root",
      "password": "CercaTrova4",
      "database": "agendaut",
      "entities":[join(__dirname, '**', '*.entity.{ts,js}')],
      "synchronize": true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
