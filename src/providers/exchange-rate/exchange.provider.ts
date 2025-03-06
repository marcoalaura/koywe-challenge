import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExchangeProvider {
  private readonly apiUrl = process.env.EXCHANGE_API_URL || 'https://api.exchange.cryptomkt.com/api/3/public/price/rate';

  async getExchangeRate(from: string, to: string): Promise<number | null> {
    try {
      const response = await axios.get(`${this.apiUrl}?from=${from}&to=${to}`);

      // Validar la estructura de la respuesta
      const exchangeData = response.data;
      if (exchangeData[from] && exchangeData[from].currency === to) {
        return parseFloat(exchangeData[from].price);
      }

      return null; // Si no se encuentra la tasa de cambio, devolver null
    } catch (error) {
      console.error('Error fetching exchange rate:', error.message);
      throw new InternalServerErrorException('Failed to fetch exchange rate');
    }
  }
}
