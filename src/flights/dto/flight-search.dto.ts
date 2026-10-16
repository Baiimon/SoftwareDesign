import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FlightSearchDto {
  @ApiProperty({ example: 15 })
  @IsNumber()
  @IsNotEmpty()
  day: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  month: number;

  @ApiProperty({ example: 2026 })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 'BKK' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: 'CNX' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({ example: 3500 })
  @IsNumber()
  @IsOptional()
  budget?: number;
}
