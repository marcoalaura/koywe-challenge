import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: { username: string; password: string }) {
    // Simulación de validación (aquí podrías validar con la BD)
    if (user.username !== 'admin' || user.password !== '1234') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar token JWT
    return {
      access_token: this.jwtService.sign({ username: user.username }),
    };
  }
}
