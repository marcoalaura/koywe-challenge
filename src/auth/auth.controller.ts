import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth') // Categoriza los endpoints de autenticación
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión y obtener un token JWT' })
  @ApiResponse({ status: 201, description: 'Autenticación exitosa' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }
}
