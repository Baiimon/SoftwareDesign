import { ProvinceScoresDTO } from '../dto/province.dto';

export interface ProvinceEnrichment {
  scores: ProvinceScoresDTO;
  highlights: string[];
}

export const provinceEnrichmentByNameEn: Record<string, ProvinceEnrichment> = {
  'Chiang Mai': {
    scores: {
      nature: 9.5,
      culture: 9.0,
      food: 9.2,
      budgetFriendly: 8.0,
      transportation: 8.5,
    },
    highlights: ['ดอยอ่างขาง', 'วัดพระธาตุดอยสุเทพ', 'ถนนคนเดินท่าแพ'],
  },
  Phuket: {
    scores: {
      nature: 9.2,
      culture: 7.5,
      food: 8.8,
      budgetFriendly: 6.0,
      transportation: 7.5,
    },
    highlights: ['หาดป่าตอง', 'ย่านเมืองเก่าภูเก็ต', 'แหลมพรหมเทพ'],
  },
  Nan: {
    scores: {
      nature: 9.0,
      culture: 9.2,
      food: 8.0,
      budgetFriendly: 8.8,
      transportation: 6.5,
    },
    highlights: ['ถนนคนเดินน่าน', 'วัดภูมินทร์', 'ปัว'],
  },
};
