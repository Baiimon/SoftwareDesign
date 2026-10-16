import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { ProvincesModule } from './provinces/provinces.module';
import { TransitModule } from './transit/transit.module';

import { FlightsModule } from './flights/flights.module';
import { DataGothModule } from './data-goth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ทำให้เรียกใช้ .env ได้ทั้งโปรเจกต์
    HttpModule,
    TransitModule,
    ProvincesModule,
    FlightsModule,
    DataGothModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
