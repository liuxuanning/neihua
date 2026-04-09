import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Review } from './review.entity';
import { Knowledge } from '../knowledge/knowledge.entity';
import { SubmitReviewDto, ReviewStatsDto } from './dto/review.dto';
import { MemoryAlgorithmService } from './memory-algorithm.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Knowledge)
    private knowledgeRepository: Repository<Knowledge>,
    private memoryAlgorithm: MemoryAlgorithmService,
  ) {}

  async getTodayReviews(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const knowledgeItems = await this.knowledgeRepository
      .createQueryBuilder('knowledge')
      .where('knowledge.user.id = :userId', { userId })
      .andWhere('knowledge.nextReviewDate < :tomorrow', { tomorrow })
      .orderBy('knowledge.easeFactor', 'ASC')
      .getMany();

    return {
      total: knowledgeItems.length,
      items: knowledgeItems,
    };
  }

  async submitReview(userId: string, submitDto: SubmitReviewDto) {
    const { knowledgeId, score, userAnswer, duration } = submitDto;

    // 获取知识点
    const knowledge = await this.knowledgeRepository.findOne({
      where: { id: knowledgeId, user: { id: userId } },
    });

    if (!knowledge) {
      throw new Error('知识点不存在');
    }

    // 计算下次复习时间
    const schedule = this.memoryAlgorithm.calculateNextReview(
      knowledge.interval,
      knowledge.easeFactor,
      knowledge.reviewCount,
      score,
    );

    // 创建复习记录
    const review = this.reviewRepository.create({
      knowledge: { id: knowledgeId },
      knowledgeId,
      reviewDate: new Date(),
      score,
      interval: schedule.interval,
      easeFactor: schedule.easeFactor,
      nextReviewDate: schedule.nextReviewDate,
      userAnswer,
      duration,
    });

    await this.reviewRepository.save(review);

    // 更新知识点
    knowledge.interval = schedule.interval;
    knowledge.easeFactor = schedule.easeFactor;
    knowledge.nextReviewDate = schedule.nextReviewDate;
    knowledge.lastReviewDate = new Date();
    knowledge.reviewCount += 1;

    await this.knowledgeRepository.save(knowledge);

    return {
      review,
      nextReviewDate: schedule.nextReviewDate,
    };
  }

  async getReviewCalendar(userId: string, days: number) {
    const knowledgeItems = await this.knowledgeRepository.find({
      where: { user: { id: userId } },
      select: ['nextReviewDate'],
    });

    return this.memoryAlgorithm.generateReviewCalendar(knowledgeItems, days);
  }

  async getStats(userId: string): Promise<ReviewStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalReviews = await this.reviewRepository.count({
      where: { knowledge: { user: { id: userId } } },
    });

    const todayReviews = await this.reviewRepository.count({
      where: {
        knowledge: { user: { id: userId } },
        reviewDate: MoreThanOrEqual(today),
      },
    });

    const avgResult = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.score)', 'avg')
      .innerJoin('review.knowledge', 'knowledge')
      .where('knowledge.user.id = :userId', { userId })
      .getRawOne();

    const knowledgeStats = await this.knowledgeRepository
      .createQueryBuilder('knowledge')
      .select([
        'SUM(CASE WHEN knowledge.easeFactor >= 2.3 THEN 1 ELSE 0 END) as mastered',
        'SUM(CASE WHEN knowledge.easeFactor BETWEEN 1.5 AND 2.3 AND knowledge.reviewCount > 2 THEN 1 ELSE 0 END) as learning',
        'SUM(CASE WHEN knowledge.reviewCount = 0 THEN 1 ELSE 0 END) as new',
      ])
      .where('knowledge.user.id = :userId', { userId })
      .getRawOne();

    // 计算连续学习天数
    const streakDays = await this.calculateStreak(userId);

    return {
      totalReviews,
      todayReviews,
      streakDays,
      averageScore: parseFloat(avgResult.avg) || 0,
      knowledgeMastered: parseInt(knowledgeStats.mastered) || 0,
      knowledgeLearning: parseInt(knowledgeStats.learning) || 0,
      knowledgeNew: parseInt(knowledgeStats.new) || 0,
    };
  }

  async getHistory(userId: string, page: number, limit: number) {
    const [items, total] = await this.reviewRepository.findAndCount({
      where: { knowledge: { user: { id: userId } } },
      relations: ['knowledge'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  private async calculateStreak(userId: string): Promise<number> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .select('DATE(review.reviewDate)', 'date')
      .innerJoin('review.knowledge', 'knowledge')
      .where('knowledge.user.id = :userId', { userId })
      .groupBy('DATE(review.reviewDate)')
      .orderBy('date', 'DESC')
      .getRawMany();

    if (reviews.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const review of reviews) {
      const reviewDate = new Date(review.date);
      reviewDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streak) {
        streak++;
        currentDate = reviewDate;
      } else {
        break;
      }
    }

    return streak;
  }
}
