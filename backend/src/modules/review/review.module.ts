import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MemoryAlgorithmService } from './memory-algorithm.service';
import { Review } from './review.entity';
import { Knowledge } from '../knowledge/knowledge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Knowledge])],
  controllers: [ReviewController],
  providers: [ReviewService, MemoryAlgorithmService],
  exports: [ReviewService, MemoryAlgorithmService],
})
export class ReviewModule {}
