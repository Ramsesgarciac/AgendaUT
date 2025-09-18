// src/auth/auth.controller.ts
import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Usuario } from '../usuario/entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // Endpoint para verificar la configuración (SOLO PARA DESARROLLO)
  @Public()
  @Get('debug')
  getDebugInfo() {
    return {
      jwt_secret_configured: !!this.configService.get<string>('JWT_SECRET'),
      jwt_secret_preview: this.configService.get<string>('JWT_SECRET')?.substring(0, 10) + '...',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    // Log para debugging
    console.log('Token generado:', result.access_token.substring(0, 50) + '...');
    
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: Usuario) {
    return this.authService.getProfile(user);
  }
}