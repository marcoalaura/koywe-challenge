import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { PrismaService } from '../providers/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiExchangeProvider } from '../providers/exchange-rate/exchange.provider';

@Module({
  imports: [AuthModule],
  controllers: [QuoteController],
  providers: [QuoteService, PrismaService, JwtAuthGuard, ApiExchangeProvider],  
})
export class QuoteModule {}
