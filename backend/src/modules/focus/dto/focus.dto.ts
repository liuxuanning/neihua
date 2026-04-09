import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  Min,
  IsDateString,
} from 'class-validator';

export class StartFocusDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  plannedDuration?: number;

  @IsOptional()
  @IsString()
  knowledgeId?: string;

  @IsOptional()
  @IsString()
  backgroundSound?: string;
}

export class EndFocusDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  distractions?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

export class FocusStatsDto {
  totalSessions: number;
  totalDuration: number;
  todayDuration: number;
  weekDuration: number;
  averageSessionDuration: number;
  streakDays: number;
  longestStreak: number;
}
