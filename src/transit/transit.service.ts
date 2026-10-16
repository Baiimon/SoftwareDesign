import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MichelinService } from '../michelin/michelin.service';

@Injectable()
export class TransitService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly michelinService: MichelinService,
  ) {}

  async fetchSingleDataset(datasetId: string, apiKey: string) {
    const url = `https://opend.data.go.th/get-ckan/datastore_search`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'api-key': apiKey },
          params: { resource_id: datasetId, limit: 10 },
        }),
      );

      const rawData = response.data;

      if (
        rawData &&
        rawData.success &&
        rawData.result &&
        rawData.result.records
      ) {
        const records = rawData.result.records;

        return {
          dataset_id: datasetId,
          status: 'success',
          source:
            records.length > 0
              ? records[0]['ที่มา'] || records[0]['หน่วยงาน'] || 'data.go.th'
              : 'data.go.th',
          total_records: rawData.result.total,
          bus_lines: records.map((record: any) => {
            const routeName =
              record['เส้นทางการเดินรถ'] ||
              record['รายการ'] ||
              record['ชื่อเส้นทาง'] ||
              record['เส้นทางเดินรถ'] ||
              record['ชื่อสาย'] ||
              record['สายที่'] ||
              record['ประเภทรถ'] ||
              record['สถานี'] ||
              'ไม่ระบุข้อมูล';

            const origin =
              record['สถานที่'] ||
              record['จุดจอด'] ||
              record['จังหวัด'] ||
              record['อำเภอ'] ||
              record['ต้นทาง'] ||
              record['ที่ตั้ง'] ||
              '-';

            const destination =
              record['ปลายทาง'] ||
              record['ประเภท'] ||
              record['หน่วย'] ||
              record['หมายเหตุ'] ||
              '-';

            const rawFare =
              record['อัตราค่าโดยสาร'] ||
              record['ค่าโดยสาร'] ||
              record['ราคา'] ||
              record['ราคา (บาท)'] ||
              0;

            const fareRate = !isNaN(parseFloat(rawFare))
              ? parseFloat(rawFare)
              : 0;

            return {
              route_number: routeName,
              origin_stop: origin,
              destination_stop: destination,
              fare_rate: fareRate,
            };
          }),
        };
      }
      return rawData;
    } catch (error: any) {
      console.error(`Error fetching dataset ${datasetId}:`, error.message);
      return {
        dataset_id: datasetId,
        status: 'error',
        message: 'ไม่สามารถดึงข้อมูลได้',
      };
    }
  }

  async fetchMultipleTransitRoutes(datasetIds?: string[]) {
    const apiKey = this.configService.get<string>('DATAGOTH_API_KEY');

    if (!apiKey) {
      throw new HttpException(
        'No API key found in request',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const defaultDatasets = [
      'aaab75ef-11ef-4829-96d2-323720360401',
      '9ef411ab-7583-4149-a0e9-4b5cc2b9baf9',
      '47e09833-8e89-49a8-82ed-4f5028742273',
      'b6ab5d37-12fe-4fef-af80-01a4a5554067',
      'd35dc2fb-f63e-4ef7-9e14-4de0b9ae8d60',
      'c9c26df1-6c38-4526-9404-67d17ac45062',
    ];

    const targets =
      datasetIds && datasetIds.length > 0 ? datasetIds : defaultDatasets;

    const results = await Promise.all(
      targets.map((id) => this.fetchSingleDataset(id, apiKey)),
    );

    return {
      total_datasets: results.length,
      data: results,
    };
  }

  async calculateRoute(
    origin: string,
    destination: string,
    isFromMichelin: boolean,
  ) {
    const finalOrigin = origin;
    let finalDestination = destination;

    if (isFromMichelin) {
      console.log(
        `User clicked from Michelin page. Searching for restaurant: ${destination}...`,
      );
      try {
        const michelinData = await this.michelinService.searchMichelin({
          datasetId: '10c483c0-45e8-41b5-adaf-8e0aa90c9422',
          restaurant: destination,
          limit: 1,
        });

        // แก้ไขการเช็คเงื่อนไขให้ตรงกับโครงสร้างใหม่ของ MichelinService
        if (
          michelinData &&
          michelinData.status === 'success' &&
          michelinData.restaurants &&
          michelinData.restaurants.length > 0
        ) {
          const restaurant = michelinData.restaurants[0];

          // เปลี่ยนไปใช้คีย์ .district แทน ['อำเภอ']
          finalDestination = restaurant.district || destination;
          console.log(`Found restaurant! Routing to: ${finalDestination}`);
        } else {
          return {
            status: 'error',
            message: 'ไม่พบข้อมูลร้านมิชลินที่คุณระบุ',
          };
        }
      } catch (error: any) {
        // MichelinService ตัวใหม่มีการ throw NotFoundException (404) ถ้าไม่เจอร้าน
        if (error.status === 404) {
          return {
            status: 'error',
            message: 'ไม่พบข้อมูลร้านมิชลินที่คุณระบุ',
          };
        }
        console.error('Error fetching from Michelin Service:', error);
        return {
          status: 'error',
          message: 'ระบบร้านมิชลินมีปัญหา ไม่สามารถค้นหาเส้นทางได้',
        };
      }
    }

    if (!finalOrigin || !finalDestination) {
      return { status: 'error', message: 'กรุณาระบุต้นทางและปลายทาง' };
    }

    const openData = await this.fetchMultipleTransitRoutes();

    let matchedRoutes: any[] = [];

    openData.data.forEach((dataset) => {
      if (dataset.status === 'success' && dataset.bus_lines) {
        const found = dataset.bus_lines.filter((bus: any) => {
          const matchOrigin =
            (bus.origin_stop && bus.origin_stop.includes(finalOrigin)) ||
            (bus.route_number && bus.route_number.includes(finalOrigin));
          const matchDestination =
            (bus.destination_stop &&
              bus.destination_stop.includes(finalDestination)) ||
            (bus.route_number && bus.route_number.includes(finalDestination));

          return matchOrigin && matchDestination;
        });
        matchedRoutes = [...matchedRoutes, ...found];
      }
    });

    if (matchedRoutes.length === 0) {
      return {
        status: 'not_found',
        message: 'ไม่พบเส้นทางรถโดยสารสาธารณะ',
        suggestion:
          'ขอแนะนำทางเลือกอื่น เช่น แท็กซี่, แกร็บ หรือแอปเรียกรถอื่นๆ',
      };
    }

    return {
      status: 'found',
      message: 'ค้นพบเส้นทาง',
      route_options: {
        economy: {
          route_details: matchedRoutes[0],
          step_by_step: [
            `เดินไปจุดขึ้นรถบริเวณ ${finalOrigin}`,
            `ขึ้นรถสาย ${matchedRoutes[0].route_number}`,
            `ลงที่ ${finalDestination}`,
          ],

          estimated_price:
            matchedRoutes[0].fare_rate > 0
              ? `${matchedRoutes[0].fare_rate} บาท`
              : 'ไม่ระบุในระบบ (อาจคิดค่าโดยสารตามระยะทาง)',
          walking_guide: 'เดินเท้าต่อไปยังจุดหมายตามแผนที่',
        },
      },
    };
  }
}
