/**
 * 记忆引擎服务
 * 结合艾宾浩斯遗忘曲线和 SuperMemo SM-2 算法
 */
import { Injectable } from '@nestjs/common';

export interface ReviewSchedule {
  nextReviewDate: Date;
  interval: number;
  easeFactor: number;
}

@Injectable()
export class MemoryAlgorithmService {
  // 艾宾浩斯标准间隔（天）
  private readonly ebbinghausIntervals = [1, 2, 4, 7, 15, 30];

  /**
   * 计算下次复习时间
   * @param currentInterval 当前间隔天数
   * @param easeFactor 难度因子
   * @param reviewCount 复习次数
   * @param score 用户评分 (0-5)
   *   0-2: 完全忘记
   *   3: 勉强记得，模糊
   *   4: 记得，稍有犹豫
   *   5: 完全记得，轻松
   */
  calculateNextReview(
    currentInterval: number,
    easeFactor: number,
    reviewCount: number,
    score: number,
  ): ReviewSchedule {
    // 前3次复习使用艾宾浩斯标准间隔
    if (reviewCount < 3) {
      const interval = this.ebbinghausIntervals[reviewCount] || 1;
      return {
        nextReviewDate: this.addDays(new Date(), interval),
        interval,
        easeFactor: this.updateEaseFactor(easeFactor, score),
      };
    }

    // 之后使用 SM-2 算法
    if (score < 3) {
      // 记忆失败，重置
      return {
        nextReviewDate: this.addDays(new Date(), 1),
        interval: 1,
        easeFactor: Math.max(1.3, easeFactor - 0.2),
      };
    }

    // 计算新间隔
    let newInterval: number;
    if (score === 3) {
      // 模糊，保持当前间隔
      newInterval = currentInterval;
    } else if (score === 4) {
      // 记得，适度增加
      newInterval = Math.round(currentInterval * easeFactor * 1.2);
    } else {
      // 完全记得，大幅增加
      newInterval = Math.round(currentInterval * easeFactor * 1.5);
    }

    const newEaseFactor = this.updateEaseFactor(easeFactor, score);

    return {
      nextReviewDate: this.addDays(new Date(), newInterval),
      interval: newInterval,
      easeFactor: newEaseFactor,
    };
  }

  /**
   * 更新难度因子 (SM-2 算法)
   */
  private updateEaseFactor(currentEF: number, score: number): number {
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const newEF =
      currentEF + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
    return Math.max(1.3, Math.min(2.5, newEF));
  }

  /**
   * 获取今日需要复习的知识点
   */
  getTodayReviewSchedule(
    knowledgeItems: Array<{
      id: string;
      nextReviewDate: Date;
      easeFactor: number;
    }>,
  ): string[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return knowledgeItems
      .filter((k) => {
        const reviewDate = new Date(k.nextReviewDate);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate <= today;
      })
      .sort((a, b) => {
        // 难度因子低的优先复习
        return a.easeFactor - b.easeFactor;
      })
      .map((k) => k.id);
  }

  /**
   * 生成复习日历
   */
  generateReviewCalendar(
    knowledgeItems: Array<{ nextReviewDate: Date }>,
    days: number = 30,
  ): Map<string, number> {
    const calendar = new Map<string, number>();
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = this.addDays(today, i);
      const dateStr = this.formatDate(date);
      calendar.set(dateStr, 0);
    }

    knowledgeItems.forEach((k) => {
      const dateStr = this.formatDate(new Date(k.nextReviewDate));
      if (calendar.has(dateStr)) {
        calendar.set(dateStr, calendar.get(dateStr)! + 1);
      }
    });

    return calendar;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
