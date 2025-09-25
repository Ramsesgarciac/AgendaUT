// src/actividades/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Actividades } from './entities/actividade.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Actividades)
    private readonly actividadesRepository: Repository<Actividades>,
    private readonly mailService: MailService,
  ) {}

  // Ejecutar todos los días a las 9:00 AM
  @Cron('0 9 * * *')
  async checkAndSendReminders(): Promise<void> {
    this.logger.log('🔍 Iniciando verificación de recordatorios de actividades...');
    
    try {
      await Promise.all([
        this.sendRemindersForDays(7, 'Recordatorio preventivo'),
        this.sendRemindersForDays(1, 'Alerta urgente'),
        this.sendRemindersForDays(0, 'Notificación crítica - vence hoy'), // Nueva línea
      ]);
      
      this.logger.log('✅ Verificación de recordatorios completada');
    } catch (error) {
      this.logger.error('❌ Error durante la verificación de recordatorios:', error);
    }
  }

  private async sendRemindersForDays(days: number, description: string): Promise<void> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    // Configurar el rango del día (de 00:00 a 23:59)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const actividades = await this.actividadesRepository.find({
      where: {
        fechaLimite: Between(startOfDay, endOfDay),
      },
      relations: ['area', 'area.usuarios', 'userCreate', 'status'],
    });

    if (actividades.length === 0) {
      this.logger.log(`📭 No hay actividades que venzan en ${days} días (${description})`);
      return;
    }

    this.logger.log(`📬 ${description}: Encontradas ${actividades.length} actividades que vencen en ${days} días`);

    for (const actividad of actividades) {
      try {
        // Obtener usuarios del área
        const usuarios = actividad.area?.usuarios || [];
        
        if (usuarios.length === 0) {
          this.logger.warn(`⚠️ El área "${actividad.area?.nombre || 'sin nombre'}" no tiene usuarios asignados para la actividad ID ${actividad.id}`);
          continue;
        }

        // Filtrar usuarios con email válido
        const usuariosConEmail = usuarios.filter(usuario => usuario.email && usuario.email.trim() !== '');
        
        if (usuariosConEmail.length === 0) {
          this.logger.warn(`⚠️ El área "${actividad.area?.nombre || 'sin nombre'}" no tiene usuarios con email para la actividad ID ${actividad.id}`);
          continue;
        }

        await this.mailService.sendActivityReminder(usuariosConEmail, actividad, days);
        
        const urgencyIcon = days === 0 ? '🚨' : days === 1 ? '⚠️' : '🔔';
        this.logger.log(`${urgencyIcon} ${description}: Recordatorio enviado para "${actividad.asunto}" (ID: ${actividad.id}) - ${days === 0 ? 'vence HOY' : `${days} días restantes`}`);
        
        // Pausa entre envíos para no sobrecargar el servidor SMTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        this.logger.error(`❌ Error enviando recordatorio para actividad ID ${actividad.id}:`, error);
      }
    }
  }

  // Método manual para testing con soporte para día 0
  async sendTestReminder(actividadId: number, days: number): Promise<void> {
    const actividad = await this.actividadesRepository.findOne({
      where: { id: actividadId },
      relations: ['area', 'area.usuarios', 'userCreate', 'status'],
    });

    if (!actividad) {
      throw new Error(`Actividad con ID ${actividadId} no encontrada`);
    }

    const usuarios = actividad.area?.usuarios || [];
    const usuariosConEmail = usuarios.filter(usuario => usuario.email && usuario.email.trim() !== '');

    if (usuariosConEmail.length === 0) {
      throw new Error(`No hay usuarios con email en el área "${actividad.area?.nombre || 'sin nombre'}"`);
    }

    await this.mailService.sendActivityReminder(usuariosConEmail, actividad, days);
    
    const description = days === 0 ? 'vence HOY' : days === 1 ? 'vence mañana' : `vence en ${days} días`;
    this.logger.log(`🧪 Test: Recordatorio enviado para "${actividad.asunto}" (ID: ${actividad.id}) - ${description}`);
  }

  // Método para obtener estadísticas de actividades próximas a vencer
  async getUpcomingActivitiesStats(): Promise<{
    today: number;
    tomorrow: number;
    nextWeek: number;
    total: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 8);

    const [vencenHoy, vencenMañana, vencenSemana] = await Promise.all([
      // Vencen hoy (día 0)
      this.actividadesRepository.count({
        where: {
          fechaLimite: Between(today, new Date(tomorrow.getTime() - 1)),
        },
      }),
      // Vencen mañana (día 1)
      this.actividadesRepository.count({
        where: {
          fechaLimite: Between(tomorrow, new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000 - 1)),
        },
      }),
      // Vencen en los próximos 8 días
      this.actividadesRepository.count({
        where: {
          fechaLimite: Between(today, nextWeek),
        },
      }),
    ]);

    return {
      today: vencenHoy,
      tomorrow: vencenMañana,
      nextWeek: vencenSemana,
      total: vencenSemana,
    };
  }
}