import { Injectable, Logger } from '@nestjs/common';

export interface ExternalProvinceRaw {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const EXTERNAL_PROVINCE_URL =
  'https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json';

export const GEOGRAPHY_ID_TO_REGION: Record<number, string> = {
  1: 'เหนือ',
  2: 'กลาง',
  3: 'ตะวันออกเฉียงเหนือ',
  4: 'ตะวันตก',
  5: 'ตะวันออก',
  6: 'ใต้',
};

const CACHE_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class ExternalProvincesService {
  private readonly logger = new Logger(ExternalProvincesService.name);
  private cache: ExternalProvinceRaw[] | null = null;
  private cachedAt = 0;

  async fetchProvinces(): Promise<ExternalProvinceRaw[]> {
    const now = Date.now();
    if (this.cache && now - this.cachedAt < CACHE_TTL_MS) {
      this.logger.debug('Serving province list from in-memory cache');
      return this.cache;
    }

    this.logger.log(
      `Fetching province dataset from external source: ${EXTERNAL_PROVINCE_URL}`,
    );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(EXTERNAL_PROVINCE_URL, {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(
          `External source responded with HTTP ${response.status}`,
        );
      }
      const data = (await response.json()) as ExternalProvinceRaw[];
      this.cache = data;
      this.cachedAt = now;
      this.logger.log(
        `Fetched ${data.length} provinces from external source successfully`,
      );
      return data;
    } catch (err) {
      this.logger.error(
        `Failed to fetch external province data: ${(err as Error).message}`,
        (err as Error).stack,
      );
      if (this.cache) {
        this.logger.warn(
          'Falling back to last known cached copy of external data',
        );
        return this.cache;
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}
