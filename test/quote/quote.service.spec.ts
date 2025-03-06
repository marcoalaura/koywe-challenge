import { QuoteService } from '../../src/quote/quote.service';
import { PrismaService } from '../../src/providers/prisma/prisma.service';
import { ExchangeProvider } from '../../src/providers/exchange-rate/exchange.provider';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('QuoteService', () => {
  let quoteService: QuoteService;
  let prismaService: PrismaService;
  let exchangeProvider: ExchangeProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: PrismaService,
          useValue: {
            quote: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: ExchangeProvider,
          useValue: {
            getExchangeRate: jest.fn(),
          },
        },
      ],
    }).compile();

    quoteService = module.get<QuoteService>(QuoteService);
    prismaService = module.get<PrismaService>(PrismaService);
    exchangeProvider = module.get<ExchangeProvider>(ExchangeProvider);
  });

  it('debe crear una cotización correctamente', async () => {
    const mockQuote = {
      id: '1234',
      from: 'ARS',
      to: 'ETH',
      amount: 1000,
      rate: 0.0005,
      convertedAmount: 0.5,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60000), // 5 min
    };

    // Mock de la API de conversión
    jest.spyOn(exchangeProvider, 'getExchangeRate').mockResolvedValue(0.0005);
    jest.spyOn(prismaService.quote, 'create').mockResolvedValue(mockQuote);

    const result = await quoteService.createQuote({ amount: 1000, from: 'ARS', to: 'ETH' });

    expect(result).toEqual(mockQuote);
    expect(exchangeProvider.getExchangeRate).toHaveBeenCalledWith('ARS', 'ETH');
    expect(prismaService.quote.create).toHaveBeenCalled();
  });

  it('debe lanzar una excepción si la conversión es a la misma moneda', async () => {
    await expect(
      quoteService.createQuote({ amount: 1000, from: 'ARS', to: 'ARS' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar una excepción si no encuentra la tasa de cambio', async () => {
    jest.spyOn(exchangeProvider, 'getExchangeRate').mockResolvedValue(null);

    await expect(
      quoteService.createQuote({ amount: 1000, from: 'XYZ', to: 'ETH' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('debe obtener una cotización válida', async () => {
    const mockQuote = {
      id: '1234',
      from: 'ARS',
      to: 'ETH',
      amount: 1000,
      rate: 0.0005,
      convertedAmount: 0.5,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60000),
    };

    jest.spyOn(prismaService.quote, 'findUnique').mockResolvedValue(mockQuote);

    const result = await quoteService.getQuote('1234');
    expect(result).toEqual(mockQuote);
  });

  it('debe lanzar un error si la cotización no existe', async () => {
    jest.spyOn(prismaService.quote, 'findUnique').mockResolvedValue(null);

    await expect(quoteService.getQuote('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('debe lanzar un error si la cotización ha expirado', async () => {
    const expiredQuote = {
      id: '1234',
      from: 'ARS',
      to: 'ETH',
      amount: 1000,
      rate: 0.0005,
      convertedAmount: 0.5,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() - 10 * 60000), // Expirado
    };

    jest.spyOn(prismaService.quote, 'findUnique').mockResolvedValue(expiredQuote);

    await expect(quoteService.getQuote('1234')).rejects.toThrow(NotFoundException);
  });
});
