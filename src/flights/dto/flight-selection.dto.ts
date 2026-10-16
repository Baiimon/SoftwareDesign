import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FlightSelectionDto {
  @ApiProperty({ example: 'SRCH-20261015-8921' })
  @IsString()
  @IsNotEmpty()
  searchId: string;

  @ApiProperty({ example: 'FL-101' })
  @IsString()
  @IsNotEmpty()
  flightId: string;

  @ApiProperty({ example: 'FD' })
  @IsString()
  @IsNotEmpty()
  airlineCode: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  passengerCount: number;
}
