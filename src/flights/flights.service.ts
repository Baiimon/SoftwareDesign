import { Injectable, BadRequestException } from '@nestjs/common';
import { FlightSearchDto } from './dto/flight-search.dto';
import { FlightSelectionDto } from './dto/flight-selection.dto';

@Injectable()
export class FlightsService {
  search(dto: FlightSearchDto) {
    if (
      !dto.day ||
      !dto.month ||
      !dto.year ||
      !dto.origin ||
      !dto.destination
    ) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'INCOMPLETE_DATA',
        error: 'Bad Request',
      });
    }

    const mockFlights = [
      {
        flightId: 'FL-101',
        airlineCode: 'FD',
        airlineName: 'Thai AirAsia',
        price: 1800,
        isWithinBudget: dto.budget ? 1800 <= dto.budget : true,
      },
      {
        flightId: 'FL-202',
        airlineCode: 'TG',
        airlineName: 'Thai Airways',
        price: 3200,
        isWithinBudget: dto.budget ? 3200 <= dto.budget : true,
      },
    ];

    return {
      searchId: `SRCH-${dto.year}${dto.month}${dto.day}-8921`,
      origin: dto.origin,
      destination: dto.destination,
      flights: mockFlights,
    };
  }

  select(dto: FlightSelectionDto) {
    return {
      bookingId: `BK-${Date.now()}`,
      status: 'CONFIRMED',
      searchId: dto.searchId,
      flightId: dto.flightId,
      airlineCode: dto.airlineCode,
      passengerCount: dto.passengerCount,
      totalPrice: 1800 * dto.passengerCount,
    };
  }
}
