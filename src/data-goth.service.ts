import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DataGothService {
  constructor(private readonly httpService: HttpService) {}

  async getDataset(datasetId: string, apiKey?: string) {
    const url = `https://data.go.th/api/3/action/package_show?id=${datasetId}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(url, {
          headers: apiKey ? { 'api-key': apiKey } : {},
        }),
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch data from Data.go.th',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
