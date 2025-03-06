import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuoteDto {
  @ApiProperty({ example: 1000000, description: 'Monto a convertir' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'ARS', description: 'Código de la moneda origen' })
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({ example: 'ETH', description: 'Código de la moneda destino' })
  @IsNotEmpty()
  @IsString()
  to: string;
}
