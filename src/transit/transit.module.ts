import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // 1. นำเข้า HttpModule
import { TransitController } from './transit.controller';
import { TransitService } from './transit.service';
import { MichelinModule } from '../michelin/michelin.module';

@Module({
  imports: [MichelinModule, HttpModule],
  controllers: [TransitController],
  providers: [TransitService],
})
export class TransitModule {}
