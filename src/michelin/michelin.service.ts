import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MichelinService {
  constructor(private readonly httpService: HttpService) {}

  async searchMichelin(query: {
    datasetId?: string;
    amphoe?: string;
    tambon?: string;
    restaurant?: string;
    limit?: number;
  }) {
    const targetDatasetId =
      query.datasetId || '10c483c0-45e8-41b5-adaf-8e0aa90c9422';
    // สลับกลับไปใช้ URL เดิมที่ไม่ต้องง้อ API Key
    const url = `https://data.go.th/api/3/action/datastore_search`;

    const filterObj: any = {};
    if (query.amphoe) filterObj['อำเภอ'] = query.amphoe;
    if (query.tambon) filterObj['ตำบล'] = query.tambon;
    if (query.restaurant) filterObj['รายชื่อร้านอาหาร'] = query.restaurant;

    const params: any = {
      resource_id: targetDatasetId,
      limit: query.limit || 10,
    };

    if (Object.keys(filterObj).length > 0) {
      params.filters = JSON.stringify(filterObj);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      const rawData = response.data;

      if (
        rawData &&
        rawData.success &&
        rawData.result &&
        rawData.result.records
      ) {
        const records = rawData.result.records;

        if (records.length === 0) {
          throw new NotFoundException({
            statusCode: 404,
            message: 'ไม่พบข้อมูลร้านอาหารตามเงื่อนไขที่ระบุ',
          });
        }

        return {
          status: 'success',
          source:
            records.length > 0
              ? records[0]['ที่มา'] || 'data.go.th'
              : 'data.go.th',
          total_records: rawData.result.total,
          restaurants: records.map((record: any) => ({
            district: record['อำเภอ'] || '-',
            sub_district: record['ตำบล'] || '-',
            restaurant_name: record['รายชื่อร้านอาหาร'] || 'ไม่ระบุข้อมูล',
            recommended_menu: record['เมนูแนะนำ'] || '-',
          })),
        };
      }

      return rawData;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error.response?.data || error.message);
      throw new HttpException(
        'ไม่สามารถเชื่อมต่อกับ data.go.th ได้',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
