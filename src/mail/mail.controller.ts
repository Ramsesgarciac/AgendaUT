// src/mail/mail.controller.ts - Crear este archivo nuevo
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { ActividadesService } from '../actividades/actividades.service';

@Controller('mail') // Endpoints públicos para testing
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly actividadesService: ActividadesService,
  ) {}

  // 1. Probar conexión SMTP (sin autenticación)
  @Get('test-connection')
  async testConnection() {
    try {
      const isConnected = await this.mailService.testConnection();
      return { 
        success: isConnected,
        message: isConnected ? 'Conexión SMTP exitosa ✅' : 'Error en conexión SMTP ❌',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error en conexión SMTP ❌',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 2. Enviar email de prueba (sin autenticación)
  @Post('test-send')
  async sendTestEmail(@Body() body: { email: string }) {
    try {
      if (!body.email) {
        throw new BadRequestException('El campo email es requerido');
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        throw new BadRequestException('Formato de email inválido');
      }

      await this.mailService.sendTestEmail(body.email);
      
      return { 
        success: true,
        message: `Email de prueba enviado exitosamente a ${body.email} ✅`,
        note: 'Revisa tu bandeja de entrada y carpeta de spam',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error enviando email de prueba ❌',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 3. Probar notificación de actividad (sin autenticación)
  @Post('test-activity-notification/:id')
  async testActivityNotification(
    @Param('id', ParseIntPipe) actividadId: number,
    @Body() body: { email: string, days?: number }
  ) {
    try {
      if (!body.email) {
        throw new BadRequestException('El campo email es requerido');
      }

      const diasRestantes = body.days || 8;
      
      if (diasRestantes < 1 || diasRestantes > 30) {
        throw new BadRequestException('Los días deben estar entre 1 y 30');
      }

      // Obtener la actividad
      const actividad = await this.actividadesService.findOne(actividadId);
      
      // Crear usuario ficticio para la prueba
      const usuarioPrueba = [{
        id: 999,
        email: body.email,
        rol: 'test',
        contraseña: '',
        fechaCreacion: new Date(),
        areas: [],
        actividadesCreadas: [],
        notas: [],
        comentarios: []
      }];

      await this.mailService.sendActivityReminder(usuarioPrueba, actividad, diasRestantes);
      
      return {
        success: true,
        message: `Notificación de prueba enviada a ${body.email} ✅`,
        actividad: {
          id: actividad.id,
          asunto: actividad.asunto,
          tipoActividad: actividad.tipoActividad,
          fechaLimite: actividad.fechaLimite,
          area: actividad.area?.nombre || 'Sin área',
          diasRestantes: diasRestantes
        },
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        success: false,
        message: 'Error enviando notificación ❌',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 4. Endpoint para obtener información de configuración (sin datos sensibles)
  @Get('config-info')
  async getConfigInfo() {
    const mailHost = process.env.MAIL_HOST || 'No configurado';
    const mailPort = process.env.MAIL_PORT || 'No configurado';
    const mailUser = process.env.MAIL_USER || 'No configurado';
    const hasPassword = !!process.env.MAIL_PASS;

    return {
      configuration: {
        host: mailHost,
        port: mailPort,
        user: mailUser,
        passwordConfigured: hasPassword,
        timestamp: new Date().toISOString()
      },
      note: 'Esta información es solo para verificar la configuración'
    };
  }
}