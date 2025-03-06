import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteDto } from '../models/dtos/quote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createQuote(@Body() quoteDto: QuoteDto) {
    return this.quoteService.createQuote(quoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getQuote(@Param('id') id: string) {
    return this.quoteService.getQuote(id);
  }
}
