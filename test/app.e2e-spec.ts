import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/providers/prisma/prisma.service';

describe('API End-to-End Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Aplicar validaciones globales como en main.ts
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await prisma.quote.deleteMany(); // Limpiar las cotizaciones después de las pruebas
    await app.close();
  });

  // Ruta principal
  // 1. Prueba de autenticación: Login y generación de token JWT
  it('Debe autenticar y devolver un token (POST /auth/login)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: '1234' })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    accessToken = response.body.access_token; // Guardamos el token para las siguientes pruebas
  });

  // 2. Prueba de creación de cotización
  it('Debe crear una cotización (POST /quote)', async () => {
    const response = await request(app.getHttpServer())
      .post('/quote')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ amount: 1000000, from: 'ARS', to: 'ETH' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.from).toBe('ARS');
    expect(response.body.to).toBe('ETH');
    expect(response.body.amount).toBe(1000000);
    expect(response.body).toHaveProperty('rate');
    expect(response.body).toHaveProperty('convertedAmount');
  });

  // 3. Prueba de obtención de cotización por ID
  it('Debe obtener una cotización existente (GET /quote/:id)', async () => {
    // Creamos una cotización primero
    const createdQuote = await request(app.getHttpServer())
      .post('/quote')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ amount: 5000, from: 'USDT', to: 'BTC' })
      .expect(201);

    const quoteId = createdQuote.body.id;

    // Consultamos la cotización creada
    const response = await request(app.getHttpServer())
      .get(`/quote/${quoteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.id).toBe(quoteId);
    expect(response.body.from).toBe('USDT');
    expect(response.body.to).toBe('BTC');
  });

  // Rutas alternativas
  // 4. Prueba de error cuando la cotización no existe
  it('Debe devolver un error 404 si la cotización no existe (GET /quote/:id)', async () => {
    await request(app.getHttpServer())
      .get('/quote/nonexistent-id')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  // 5. Prueba de error sin autenticación
  it('Debe devolver un error 401 si no se proporciona un token (POST /quote)', async () => {
    await request(app.getHttpServer())
      .post('/quote')
      .send({ amount: 1000000, from: 'ARS', to: 'ETH' })
      .expect(401);
  });
});
