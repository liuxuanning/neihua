import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class SubmitReviewDto {
  @IsNumber()
  knowledgeId: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  userAnswer?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class ReviewStatsDto {
  totalReviews: number;
  todayReviews: number;
  streakDays: number;
  averageScore: number;
  knowledgeMastered: number;
  knowledgeLearning: number;
  knowledgeNew: number;
}
