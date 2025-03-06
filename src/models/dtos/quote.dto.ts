import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QuoteDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;
}
