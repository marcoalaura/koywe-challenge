import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './providers/prisma/prisma.service';
import { QuoteModule } from './quote/quote.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [QuoteModule, AuthModule],  // Se agrega AuthModule
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
