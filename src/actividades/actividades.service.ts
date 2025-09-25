// src/actividades/actividades.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividades } from './entities/actividade.entity';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { ColeccionComentarios } from '../coleccion-comentario/entities/coleccion-comentario.entity';
import { NotificationService } from './notification.service';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividades)
    private readonly actividadesRepository: Repository<Actividades>,
    @InjectRepository(ColeccionComentarios)
    private readonly coleccionComentariosRepository: Repository<ColeccionComentarios>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createActividadesDto: CreateActividadeDto): Promise<Actividades> {
    // Crear la actividad
    const actividad = this.actividadesRepository.create({
      asunto: createActividadesDto.asunto,
      instanciaReceptora: createActividadesDto.instanciaReceptora,
      instanciaEmisora: createActividadesDto.instanciaEmisora,
      tipoActividad: createActividadesDto.tipoActividad,
      fechaLimite: new Date(createActividadesDto.fechaLimite),
      area: { id: createActividadesDto.idArea },
      userCreate: { id: createActividadesDto.idUserCreate },
      status: { id: createActividadesDto.statusId },
    });

    // Guardar la actividad primero
    const actividadGuardada = await this.actividadesRepository.save(actividad);

    // Si se solicita crear una colección de comentarios (por defecto es true)
    if (createActividadesDto.crearColeccionComentarios !== false) {
      try {
        const coleccionComentarios = this.coleccionComentariosRepository.create({
          actividad: { id: actividadGuardada.id }
        });

        await this.coleccionComentariosRepository.save(coleccionComentarios);

        console.log(`Colección de comentarios creada automáticamente para la actividad ID: ${actividadGuardada.id}`);
      } catch (error) {
        console.error('Error al crear colección de comentarios:', error);
        // No lanzamos el error para que no falle la creación de la actividad
      }
    }

    // Verificar si la actividad requiere notificación inmediata
    await this.checkAndSendImmediateNotification(actividadGuardada);

    return actividadGuardada;
  }

  async findAll(): Promise<Actividades[]> {
    return this.actividadesRepository.find({
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios', 'coleccionComentarios'],
    });
  }

  async findOne(id: number): Promise<Actividades> {
    // Validación adicional
    if (!id || isNaN(id) || id <= 0) {
      throw new NotFoundException(`ID de actividad inválido: ${id}`);
    }

    const actividad = await this.actividadesRepository.findOne({
      where: { id },
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios', 'coleccionComentarios'],
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return actividad;
  }

  async update(id: number, updateActividadesDto: UpdateActividadeDto): Promise<Actividades> {
    // Validación adicional
    if (!id || isNaN(id) || id <= 0) {
      throw new NotFoundException(`ID de actividad inválido: ${id}`);
    }

    const actividad = await this.findOne(id);

    // Actualizar relaciones si se proporcionan
    if (updateActividadesDto.idArea) {
      actividad.area = { id: updateActividadesDto.idArea } as any;
    }

    if (updateActividadesDto.statusId) {
      actividad.status = { id: updateActividadesDto.statusId } as any;
    }

    // Actualizar propiedades básicas
    Object.assign(actividad, {
      asunto: updateActividadesDto.asunto || actividad.asunto,
      instanciaReceptora: updateActividadesDto.instanciaReceptora || actividad.instanciaReceptora,
      instanciaEmisora: updateActividadesDto.instanciaEmisora || actividad.instanciaEmisora,
      tipoActividad: updateActividadesDto.tipoActividad || actividad.tipoActividad,
      fechaLimite: updateActividadesDto.fechaLimite ? new Date(updateActividadesDto.fechaLimite) : actividad.fechaLimite,
    });

    return this.actividadesRepository.save(actividad);
  }

  async remove(id: number): Promise<void> {
    // Validación adicional
    if (!id || isNaN(id) || id <= 0) {
      throw new NotFoundException(`ID de actividad inválido: ${id}`);
    }

    const actividad = await this.findOne(id);
    
    // Opcional: Eliminar colecciones de comentarios asociadas automáticamente
    // Si tienes cascade configurado, esto se hará automáticamente
    try {
      await this.coleccionComentariosRepository.delete({ actividad: { id } });
      console.log(`🗑️ Colecciones de comentarios eliminadas para la actividad ID: ${id}`);
    } catch (error) {
      console.error('Error al eliminar colecciones de comentarios:', error);
    }
    
    await this.actividadesRepository.remove(actividad);
  }

  async findByArea(areaId: number): Promise<Actividades[]> {
    // Validación adicional
    if (!areaId || isNaN(areaId) || areaId <= 0) {
      throw new NotFoundException(`ID de área inválido: ${areaId}`);
    }

    return this.actividadesRepository.find({
      where: { area: { id: areaId } },
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios', 'coleccionComentarios'],
    });
  }

  async findByUser(userId: number): Promise<Actividades[]> {
    // Validación adicional
    if (!userId || isNaN(userId) || userId <= 0) {
      throw new NotFoundException(`ID de usuario inválido: ${userId}`);
    }

    return this.actividadesRepository.find({
      where: { userCreate: { id: userId } },
      relations: ['area', 'userCreate', 'status', 'documentos', 'comentarios', 'coleccionComentarios'],
    });
  }

  // Método adicional para crear manualmente una colección de comentarios
  async crearColeccionComentarios(actividadId: number): Promise<ColeccionComentarios> {
    // Validación adicional
    if (!actividadId || isNaN(actividadId) || actividadId <= 0) {
      throw new NotFoundException(`ID de actividad inválido: ${actividadId}`);
    }

    const actividad = await this.findOne(actividadId);
    
    const coleccionComentarios = this.coleccionComentariosRepository.create({
      actividad: { id: actividad.id }
    });
    
    return await this.coleccionComentariosRepository.save(coleccionComentarios);
  }

  // Método para verificar y enviar notificaciones inmediatas al crear actividad
  private async checkAndSendImmediateNotification(actividad: Actividades): Promise<void> {
    try {
      const ahora = new Date();
      const fechaLimite = new Date(actividad.fechaLimite);
      const diferenciaMs = fechaLimite.getTime() - ahora.getTime();
      const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

      // Si la actividad vence hoy (0 días) o mañana (1 día), enviar notificación inmediata
      if (diferenciaDias >= 0 && diferenciaDias <= 1) {
        console.log(`📢 Actividad creada con deadline cercano (${diferenciaDias} días). Enviando notificación inmediata...`);

        // Obtener la actividad completa con relaciones para enviar notificación
        const actividadCompleta = await this.findOne(actividad.id);

        // Enviar notificación inmediata usando el servicio de notificaciones
        await this.notificationService.sendTestReminder(actividad.id, diferenciaDias);

        console.log(`✅ Notificación inmediata enviada para actividad "${actividad.asunto}" (ID: ${actividad.id})`);
      }
    } catch (error) {
      console.error('❌ Error enviando notificación inmediata:', error);
      // No lanzamos el error para que no falle la creación de la actividad
    }
  }

  async enviarRecordatorioManual(actividadId: number, dias: number): Promise<string> {
    // Validación adicional
    if (!actividadId || isNaN(actividadId) || actividadId <= 0) {
      throw new NotFoundException(`ID de actividad inválido: ${actividadId}`);
    }

    if (!dias || isNaN(dias) || dias <= 0) {
      throw new NotFoundException(`Número de días inválido: ${dias}`);
    }

    // Verificar que la actividad existe
    await this.findOne(actividadId);

    await this.notificationService.sendTestReminder(actividadId, dias);

    return `Recordatorio enviado para actividad ID ${actividadId} con ${dias} días de anticipación.`;
  }
}