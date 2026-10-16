import { Controller, Get, Query } from '@nestjs/common';
import { MichelinService } from './michelin.service';

@Controller()
export class MichelinController {
  constructor(private readonly michelinService: MichelinService) {}

  @Get('open-data/data-goth/fetch-michelin-restaurants')
  async fetchMichelinRestaurants(
    @Query('amphoe') amphoe?: string,
    @Query('tambon') tambon?: string,
    @Query('restaurant') restaurant?: string,
  ) {
    return await this.michelinService.searchMichelin({
      datasetId: '10c483c0-45e8-41b5-adaf-8e0aa90c9422',
      amphoe,
      tambon,
      restaurant,
      limit: 100,
    });
  }
}
