import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Actividades } from '../actividades/entities/actividade.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendTestEmail(to: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Sistema de Actividades" <${this.configService.get('MAIL_USER')}>`,
        to: to,
        subject: '🧪 Prueba de configuración SMTP',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">✅ Configuración exitosa</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Tu sistema de correos está funcionando correctamente</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Prueba de conexión SMTP</h2>
            <p>Si estás leyendo este mensaje, significa que:</p>
            <ul>
              <li>✅ La configuración de Gmail está correcta</li>
              <li>✅ La App Password funciona</li>
              <li>✅ El servicio de correos está operativo</li>
            </ul>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #155724;">
                <strong>🎉 ¡Felicitaciones!</strong> Ya puedes implementar las notificaciones automáticas de actividades.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
              Enviado desde el Sistema de Gestión de Actividades<br>
              ${new Date().toLocaleString('es-ES')}
            </p>
          </div>
        </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email de prueba enviado a ${to}`);
      this.logger.log(`📧 Message ID: ${info.messageId}`);
      
    } catch (error) {
      this.logger.error(`❌ Error enviando email de prueba a ${to}:`, error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Conexión SMTP establecida correctamente');
      return true;
    } catch (error) {
      this.logger.error('❌ Error en la conexión SMTP:', error);
      return false;
    }
  }

  async sendActivityReminder(
    usuarios: Usuario[],
    actividad: Actividades,
    diasRestantes: number,
  ): Promise<void> {
    try {
      const emails = usuarios.map(usuario => usuario.email).filter(email => email);
      
      if (emails.length === 0) {
        this.logger.warn(`No hay usuarios con email para el área ${actividad.area?.nombre || 'desconocida'}`);
        return;
      }

      const subject = this.getSubject(diasRestantes, actividad.asunto);
      const htmlContent = this.generateEmailTemplate(actividad, diasRestantes);

      const mailOptions = {
        from: `"Sistema de Actividades" <${this.configService.get('MAIL_USER')}>`,
        to: emails.join(', '),
        subject: subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`✅ Email enviado para actividad ID ${actividad.id} a ${emails.length} usuarios`);
      this.logger.log(`📧 Message ID: ${info.messageId}`);
      
    } catch (error) {
      this.logger.error(`❌ Error enviando email para actividad ID ${actividad.id}:`, error);
      throw error;
    }
  }

  private getSubject(diasRestantes: number, asunto: string): string {
    if (diasRestantes === 8) {
      return `🔔 Recordatorio: Actividad próxima a vencer en 8 días - ${asunto}`;
    } else if (diasRestantes === 1) {
      return `🚨 URGENTE: Actividad vence mañana - ${asunto}`;
    }
    return `📋 Recordatorio de actividad - ${asunto}`;
  }

  private generateEmailTemplate(actividad: Actividades, diasRestantes: number): string {
    const urgencyColor = diasRestantes === 1 ? '#dc3545' : '#ffc107';
    const urgencyText = diasRestantes === 1 ? 'URGENTE' : 'RECORDATORIO';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificación de Actividad</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Sistema de Actividades</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Notificación Automática</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <span style="background: ${urgencyColor}; color: white; padding: 8px 20px; border-radius: 25px; font-weight: bold; font-size: 14px;">
                    ${urgencyText}
                </span>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Actividad próxima a vencer</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #495057; margin-top: 0;">📋 Detalles de la Actividad</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Asunto:</td>
                        <td style="padding: 8px 0;">${actividad.asunto}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Tipo:</td>
                        <td style="padding: 8px 0;">${actividad.tipoActividad}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Área asignada:</td>
                        <td style="padding: 8px 0;"><strong>${actividad.area?.nombre || 'No asignada'}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Fecha Límite:</td>
                        <td style="padding: 8px 0; color: ${urgencyColor}; font-weight: bold;">
                            📅 ${this.formatDate(actividad.fechaLimite)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Días restantes:</td>
                        <td style="padding: 8px 0; color: ${urgencyColor}; font-weight: bold; font-size: 18px;">
                            ⏰ ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}
                        </td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin: 0;">
                    Este es un mensaje automático del Sistema de Gestión de Actividades.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }
} 