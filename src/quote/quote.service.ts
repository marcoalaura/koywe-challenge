import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../providers/prisma/prisma.service';
import { QuoteDto } from '../models/dtos/quote.dto';
import { v4 as uuidv4 } from 'uuid';
import { ApiExchangeProvider } from '../providers/exchange-rate/exchange.provider';

@Injectable()
export class QuoteService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly apiExchangeProvider: ApiExchangeProvider
      ) {}

  async createQuote(data: QuoteDto) {
    // Validar que la moneda de origen y destino sean diferentes
    if (data.from === data.to) {
      throw new BadRequestException('Source and destination currencies must be different');
    }

     // Usamos el proveedor para obtener la tasa de cambio
     const rate = await this.apiExchangeProvider.getExchangeRate(data.from, data.to);

    if (!rate) {
      throw new NotFoundException('Exchange rate not available');
    }

    const convertedAmount = data.amount * rate;
    const timestamp = new Date();
    const expiresAt = new Date(timestamp.getTime() + 5 * 60000); // Expira en 5 minutos

    // Guardar la cotización en la base de datos
    const quote = await this.prisma.quote.create({
      data: {
        id: uuidv4(),
        from: data.from,
        to: data.to,
        amount: data.amount,
        rate,
        convertedAmount,
        timestamp,
        expiresAt,
      },
    });

    return quote;
  }

  async getQuote(id: string) {
    const quote = await this.prisma.quote.findUnique({ where: { id } });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    if (new Date() > quote.expiresAt) {
      throw new NotFoundException('Quote expired');
    }

    return quote;
  }
}
