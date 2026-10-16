import { Injectable, Logger } from '@nestjs/common';

export interface GovProvinceRaw {
  prov_code: string;
  prov_name: string;
  prov_id: string;
  prov_gf_code: string;
}

interface BbgfMisProvinceResponse {
  code: number;
  status: boolean;
  msg: string;
  summary?: { total: number };
  result: GovProvinceRaw[];
}

const DATA_GO_TH_URL = 'https://opend.data.go.th/govspending/bbgfmisprovince';
const CACHE_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class GovProvincesService {
  private readonly logger = new Logger(GovProvincesService.name);
  private cache: GovProvinceRaw[] | null = null;
  private cachedAt = 0;

  async fetchProvinces(): Promise<GovProvinceRaw[]> {
    const apiKey = process.env.DATAGOTH_API_KEY;
    if (!apiKey) {
      throw new Error(
        'DATA_GO_TH_API_KEY ยังไม่ถูกตั้งค่า — ลงทะเบียนขอฟรีที่ https://opend.data.go.th/register_api แล้วใส่ใน .env',
      );
    }

    const now = Date.now();
    if (this.cache && now - this.cachedAt < CACHE_TTL_MS) {
      this.logger.debug(
        'Serving province list from data.go.th in-memory cache',
      );
      return this.cache;
    }

    const url = `${DATA_GO_TH_URL}?api-key=${encodeURIComponent(apiKey)}`;
    this.logger.log(
      'Fetching official province list from data.go.th (BBGFProvince)',
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`data.go.th responded with HTTP ${response.status}`);
      }
      const body = (await response.json()) as BbgfMisProvinceResponse;
      if (!body.status || !Array.isArray(body.result)) {
        throw new Error(
          `data.go.th returned an unexpected payload: ${body.msg || 'unknown error'}`,
        );
      }
      this.cache = body.result;
      this.cachedAt = now;
      this.logger.log(
        `Fetched ${body.result.length} provinces from data.go.th successfully`,
      );
      return body.result;
    } catch (err) {
      this.logger.error(
        `Failed to fetch from data.go.th: ${(err as Error).message}`,
      );
      if (this.cache) {
        this.logger.warn(
          'Falling back to last known cached copy of data.go.th data',
        );
        return this.cache;
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}
