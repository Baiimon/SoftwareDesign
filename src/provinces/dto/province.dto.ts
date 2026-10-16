import { IsNotEmpty, IsString } from 'class-validator';

export class ProvinceScoresDTO {
  nature: number;
  culture: number;
  food: number;
  budgetFriendly: number;
  transportation: number;
}

export class ProvinceDTO {
  id: number;
  provinceId: string;
  nameTh: string;
  nameEn: string;
  region: string;
  scores: ProvinceScoresDTO | null;
  highlights: string[];
  // 'data.go.th+github' = หลัก (ทางการ+เสริมชื่ออังกฤษ/ภูมิภาค) | 'data.go.th' = หลักอย่างเดียว
  // 'github' = สำรองชั้น 2 | 'offline' = สำรองสุดท้าย (curated เอง)
  source: 'data.go.th+github' | 'data.go.th' | 'github' | 'offline';
}

export class ComparisonRequestDTO {
  @IsNotEmpty({ message: 'กรุณาระบุข้อมูลจังหวัดที่ 1 ให้ครบถ้วน' })
  @IsString()
  provinceId1: string;

  @IsNotEmpty({ message: 'กรุณาระบุข้อมูลจังหวัดที่ 2 ให้ครบถ้วน' })
  @IsString()
  provinceId2: string;
}

export class ComparisonResponseDTO {
  provinces: [ProvinceDTO, ProvinceDTO];
  winnerByCategory: {
    nature: string;
    culture: string;
    food: string;
    budgetFriendly: string;
    transportation: string;
  };
  overallWinner: string;
  recommendation: string;
}
