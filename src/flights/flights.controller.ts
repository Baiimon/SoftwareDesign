import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlightsService } from './flights.service';
import { FlightSearchDto } from './dto/flight-search.dto';
import { FlightSelectionDto } from './dto/flight-selection.dto';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('search')
  @ApiOperation({ summary: 'ค้นหาเที่ยวบิน' })
  searchFlights(@Query() dto: FlightSearchDto) {
    return this.flightsService.search(dto);
  }

  @Get('select')
  @ApiOperation({ summary: 'เลือกเที่ยวบิน' })
  selectFlight(@Query() dto: FlightSelectionDto) {
    return this.flightsService.select(dto);
  }
}
