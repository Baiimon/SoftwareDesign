import {
  Get,
  Query,
  Controller,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ComparisonsService } from './services/comparisons.service';
import { ComparisonRequestDTO } from './dto/province.dto';

@Controller('comparisons')
export class ComparisonsController {
  constructor(private readonly service: ComparisonsService) {}

  @Get()
  async compare(@Query() query: ComparisonRequestDTO) {
    const provinceId1 = query?.provinceId1;
    const provinceId2 = query?.provinceId2;

    if (!provinceId1 || !provinceId2) {
      throw new BadRequestException(
        'both provinceId1 and provinceId2 are required',
      );
    }

    const result = await this.service.compareProvinces(
      query.provinceId1,
      query.provinceId2,
    );
    if (!result) {
      throw new NotFoundException(
        'One or both provinces not found, or comparison score data unavailable for them',
      );
    }

    return result;
  }
}
