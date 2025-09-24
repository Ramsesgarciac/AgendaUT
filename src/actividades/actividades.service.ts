// src/actividades/actividades.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividades } from './entities/actividade.entity';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { ColeccionComentarios } from '../coleccion-comentario/entities/coleccion-comentario.entity';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividades)
    private readonly actividadesRepository: Repository<Actividades>,
    @InjectRepository(ColeccionComentarios)
    private readonly coleccionComentariosRepository: Repository<ColeccionComentarios>,
    // Comentamos temporalmente NotificationService hasta que lo implementes completamente
    // private readonly notificationService: NotificationService,
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

  // Método temporal para recordatorios (lo activaremos cuando implementes NotificationService)
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
    
    // Retornar mensaje temporal hasta que implementes NotificationService
    return `Recordatorio programado para actividad ID ${actividadId} con ${dias} días de anticipación. Implementación pendiente de NotificationService.`;
    
    // Una vez que tengas NotificationService implementado, descomenta esta línea:
    // return this.notificationService.sendTestReminder(actividadId, dias);
  }
}