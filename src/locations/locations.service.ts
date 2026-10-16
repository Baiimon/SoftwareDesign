import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationsService {
  private readonly locations = [
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok' },
    { code: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok' },
    {
      code: 'CNX',
      name: 'Chiang Mai International Airport',
      city: 'Chiang Mai',
    },
    { code: 'HKT', name: 'Phuket International Airport', city: 'Phuket' },
  ];

  findAll() {
    return this.locations;
  }
}
