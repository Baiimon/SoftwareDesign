import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataGothService } from './data-goth.service';

@ApiTags('Data.go.th')
@Controller('data-goth')
export class DataGothController {
  constructor(private readonly dataGothService: DataGothService) {}

  @Get('dataset')
  @ApiOperation({ summary: 'ดึงข้อมูลชุดข้อมูลจาก Data.go.th' })
  async getDataset(@Query('id') id: string, @Query('apiKey') apiKey?: string) {
    return this.dataGothService.getDataset(id, apiKey);
  }
}
