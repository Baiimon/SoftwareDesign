import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchMichelinDto {
  @IsString()
  @IsNotEmpty()
  resource_id: string;

  @IsOptional()
  @IsString()
  filters?: string;
  limit?: number;
}
