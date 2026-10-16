import { Module } from '@nestjs/common';
import { ProvincesController } from './provinces.controller';
import { ComparisonsController } from './comparisons.controller';
import { ProvincesService } from './services/provinces.service';
import { ComparisonsService } from './services/comparisons.service';
import { GovProvincesService } from './services/gov-provinces.service';
import { ExternalProvincesService } from './services/external-provinces.service';
import { FileLogger } from './common/file-logger.service';

@Module({
  controllers: [ProvincesController, ComparisonsController],
  providers: [
    ProvincesService,
    ComparisonsService,
    GovProvincesService,
    ExternalProvincesService,
    FileLogger,
  ],
})
export class ProvincesModule {}
