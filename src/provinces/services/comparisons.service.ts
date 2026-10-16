import { Injectable } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ComparisonResponseDTO } from '../dto/province.dto';

@Injectable()
export class ComparisonsService {
  constructor(private readonly provincesService: ProvincesService) {}

  public async compareProvinces(
    id1: string,
    id2: string,
  ): Promise<ComparisonResponseDTO | null> {
    const p1 = await this.provincesService.getProvinceById(id1);
    const p2 = await this.provincesService.getProvinceById(id2);

    if (!p1 || !p2) return null;
    if (!p1.scores || !p2.scores) return null;

    const categories = [
      'nature',
      'culture',
      'food',
      'budgetFriendly',
      'transportation',
    ] as const;
    const winnerByCategory: any = {};
    let scoreP1 = 0;
    let scoreP2 = 0;

    categories.forEach((cat) => {
      if (p1.scores![cat] > p2.scores![cat]) {
        winnerByCategory[cat] = p1.nameTh;
        scoreP1++;
      } else if (p2.scores![cat] > p1.scores![cat]) {
        winnerByCategory[cat] = p2.nameTh;
        scoreP2++;
      } else {
        winnerByCategory[cat] = 'เสมอ';
      }
    });

    const overallWinner =
      scoreP1 > scoreP2
        ? p1.nameTh
        : scoreP2 > scoreP1
          ? p2.nameTh
          : 'น่าเที่ยวทั้งสองจังหวัดเท่ากัน';

    return {
      provinces: [p1, p2],
      winnerByCategory,
      overallWinner,
      recommendation: `หากคุณชอบสายชิลเน้นธรรมชาติตอบโจทย์ที่สุดคือ ${overallWinner}`,
    };
  }
}
