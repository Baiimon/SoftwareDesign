import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProvincesService } from './services/provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly service: ProvincesService) {}

  @Get()
  async getProvinces() {
    return this.service.getAllProvinces();
  }

  @Get(':id')
  async getProvinceById(@Param('id') id: string) {
    const province = await this.service.getProvinceById(id);
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    return province;
  }
}
