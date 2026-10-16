import { Controller, Get, Query } from '@nestjs/common';
import { TransitService } from './transit.service';

@Controller('transit-buddy')
export class TransitController {
  constructor(private readonly transitService: TransitService) {}

  @Get('search-route')
  async searchRoute(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('from_michelin') fromMichelin: string,
  ) {
    const isFromMichelin = fromMichelin === 'true';
    return this.transitService.calculateRoute(
      origin,
      destination,
      isFromMichelin,
    );
  }

  @Get('data')
  async getRawData() {
    return this.transitService.fetchMultipleTransitRoutes();
  }
}
