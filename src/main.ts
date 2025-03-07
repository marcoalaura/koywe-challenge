import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: "http://localhost:8080",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
  }));

  // Habilitar validaciones globales
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Koywe Challenge API')
    .setDescription('API para conversión de monedas fiat y criptomonedas.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
