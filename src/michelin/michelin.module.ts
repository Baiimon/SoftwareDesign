import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MichelinController } from './michelin.controller';
import { MichelinService } from './michelin.service';

@Module({
  imports: [HttpModule],
  controllers: [MichelinController],
  providers: [MichelinService],
  exports: [MichelinService],
})
export class MichelinModule {}
