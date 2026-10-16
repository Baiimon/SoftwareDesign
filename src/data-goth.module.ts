import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DataGothService } from './data-goth.service';
import { DataGothController } from './data-goth.controller';

@Module({
  imports: [HttpModule],
  controllers: [DataGothController],
  providers: [DataGothService],
  exports: [DataGothService],
})
export class DataGothModule {}
