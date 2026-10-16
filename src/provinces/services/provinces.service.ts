import { Injectable, Logger } from '@nestjs/common';
import { ProvinceDTO } from '../dto/province.dto';
import { provinceEnrichmentByNameEn } from '../data/mockData';
import {
  ExternalProvincesService,
  GEOGRAPHY_ID_TO_REGION,
  ExternalProvinceRaw,
} from './external-provinces.service';
import { GovProvincesService, GovProvinceRaw } from './gov-provinces.service';

function normalizeThaiName(name: string): string {
  return name
    .trim()
    .replace(/^จังหวัด/, '')
    .trim();
}

@Injectable()
export class ProvincesService {
  private readonly logger = new Logger(ProvincesService.name);

  constructor(
    private readonly govProvincesService: GovProvincesService,
    private readonly externalProvincesService: ExternalProvincesService,
  ) {}

  async getAllProvinces(): Promise<ProvinceDTO[]> {
    try {
      const govList = await this.govProvincesService.fetchProvinces();
      return await this.mergeGovWithGithub(govList);
    } catch (govErr) {
      this.logger.warn(
        `data.go.th ใช้งานไม่ได้ (${(govErr as Error).message}) — ใช้ GitHub dataset แทนชั่วคราว`,
      );
    }

    try {
      const githubList = await this.externalProvincesService.fetchProvinces();
      return githubList.map((p) => this.mapGithubToDto(p));
    } catch (githubErr) {
      this.logger.error(
        `GitHub dataset ก็ใช้งานไม่ได้เช่นกัน (${(githubErr as Error).message}) — ใช้โหมดออฟไลน์`,
      );
    }

    return this.offlineFallback();
  }

  async getProvinceById(id: string): Promise<ProvinceDTO | undefined> {
    const all = await this.getAllProvinces();
    const needle = id.trim().toLowerCase();
    return all.find(
      (p) =>
        p.provinceId === id ||
        p.nameEn.toLowerCase() === needle ||
        p.nameTh === id,
    );
  }

  private async mergeGovWithGithub(
    govList: GovProvinceRaw[],
  ): Promise<ProvinceDTO[]> {
    let githubList: ExternalProvinceRaw[] = [];
    try {
      githubList = await this.externalProvincesService.fetchProvinces();
    } catch {
      this.logger.warn(
        'ดึง GitHub dataset เพื่อเสริม nameEn/region ให้ข้อมูล data.go.th ไม่สำเร็จ — จะใช้ชื่อไทยล้วนแทน',
      );
    }

    const githubByNameTh = new Map(
      githubList.map((p) => [normalizeThaiName(p.name_th), p]),
    );

    return govList.map((gov) => {
      const key = normalizeThaiName(gov.prov_name);
      const match = githubByNameTh.get(key);
      const nameEn = match?.name_en ?? gov.prov_name;
      const region = match
        ? (GEOGRAPHY_ID_TO_REGION[match.geography_id] ?? 'ไม่ทราบภูมิภาค')
        : 'ไม่ทราบภูมิภาค';
      const enrichment = provinceEnrichmentByNameEn[nameEn];

      return {
        id: Number(gov.prov_id),
        provinceId: gov.prov_id,
        nameTh: gov.prov_name,
        nameEn,
        region,
        scores: enrichment ? enrichment.scores : null,
        highlights: enrichment ? enrichment.highlights : [],
        source: match ? 'data.go.th+github' : 'data.go.th',
      };
    });
  }

  private mapGithubToDto(raw: ExternalProvinceRaw): ProvinceDTO {
    const enrichment = provinceEnrichmentByNameEn[raw.name_en];
    return {
      id: raw.id,
      provinceId: String(raw.id),
      nameTh: raw.name_th,
      nameEn: raw.name_en,
      region: GEOGRAPHY_ID_TO_REGION[raw.geography_id] ?? 'ไม่ทราบภูมิภาค',
      scores: enrichment ? enrichment.scores : null,
      highlights: enrichment ? enrichment.highlights : [],
      source: 'github',
    };
  }

  private offlineFallback(): ProvinceDTO[] {
    return Object.entries(provinceEnrichmentByNameEn).map(
      ([nameEn, enrichment], idx) => ({
        id: -(idx + 1),
        provinceId: String(-(idx + 1)),
        nameTh: nameEn,
        nameEn,
        region: 'ไม่ทราบภูมิภาค (โหมดสำรอง - ออฟไลน์)',
        scores: enrichment.scores,
        highlights: enrichment.highlights,
        source: 'offline',
      }),
    );
  }
}
