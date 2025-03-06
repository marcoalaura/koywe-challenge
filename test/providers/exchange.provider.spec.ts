import { ExchangeProvider } from '../../src/providers/exchange-rate/exchange.provider';

describe('ApiExchangeProvider', () => {
  let exchangeProvider: ExchangeProvider;

  beforeEach(() => {
    exchangeProvider = new ExchangeProvider();
  });

  it('debe retornar una tasa de cambio simulada', async () => {
    // Mock manual para evitar la consulta real
    jest.spyOn(exchangeProvider, 'getExchangeRate').mockResolvedValue(0.0005);

    const rate = await exchangeProvider.getExchangeRate('ARS', 'ETH');
    expect(rate).toBe(0.0005);
  });

  it('debe retornar null si no encuentra la tasa de cambio', async () => {
    jest.spyOn(exchangeProvider, 'getExchangeRate').mockResolvedValue(null);

    const rate = await exchangeProvider.getExchangeRate('XYZ', 'ETH');
    expect(rate).toBeNull();
  });
});
