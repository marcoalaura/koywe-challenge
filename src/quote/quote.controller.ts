import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteDto } from '../models/dtos/quote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Quotes') // Categoriza los endpoints en Swagger
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @ApiOperation({ summary: 'Crear una cotización' })
  @ApiResponse({ status: 201, description: 'Cotización creada con éxito' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiBearerAuth() // Requiere autenticación JWT
  @UseGuards(JwtAuthGuard)
  @Post()
  createQuote(@Body() quoteDto: QuoteDto) {
    return this.quoteService.createQuote(quoteDto);
  }

  @ApiOperation({ summary: 'Obtener una cotización por ID' })
  @ApiResponse({ status: 200, description: 'Cotización encontrada' })
  @ApiResponse({ status: 404, description: 'Cotización no encontrada' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getQuote(@Param('id') id: string) {
    return this.quoteService.getQuote(id);
  }
}
