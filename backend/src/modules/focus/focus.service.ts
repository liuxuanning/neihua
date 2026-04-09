import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { FocusSession } from './focus.entity';
import { StartFocusDto, EndFocusDto, FocusStatsDto } from './dto/focus.dto';

@Injectable()
export class FocusService {
  constructor(
    @InjectRepository(FocusSession)
    private focusRepository: Repository<FocusSession>,
  ) {}

  async startSession(userId: string, startDto: StartFocusDto) {
    // 检查是否有未结束的会话
    const existingSession = await this.focusRepository.findOne({
      where: {
        user: { id: userId },
        isCompleted: false,
      },
    });

    if (existingSession) {
      return existingSession;
    }

    const session = this.focusRepository.create({
      user: { id: userId },
      plannedDuration: startDto.plannedDuration || 25,
      knowledgeId: startDto.knowledgeId,
      backgroundSound: startDto.backgroundSound,
      startTime: new Date(),
      isCompleted: false,
    });

    await this.focusRepository.save(session);
    return session;
  }

  async endSession(id: string, userId: string, endDto: EndFocusDto) {
    const session = await this.focusRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!session) {
      throw new Error('专注会话不存在');
    }

    session.endTime = new Date();
    session.duration = Math.floor(
      (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60,
    );
    session.notes = endDto.notes;
    session.distractions = endDto.distractions;
    session.isCompleted = endDto.isCompleted ?? true;

    await this.focusRepository.save(session);
    return session;
  }

  async getCurrentSession(userId: string) {
    return this.focusRepository.findOne({
      where: {
        user: { id: userId },
        isCompleted: false,
      },
    });
  }

  async getStats(userId: string): Promise<FocusStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const totalSessions = await this.focusRepository.count({
      where: { user: { id: userId }, isCompleted: true },
    });

    const sessions = await this.focusRepository.find({
      where: { user: { id: userId }, isCompleted: true },
      select: ['duration', 'startTime'],
    });

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

    const todaySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
    const todayDuration = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    const weekSessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= weekAgo;
    });
    const weekDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);

    const averageSessionDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

    const { streakDays, longestStreak } = await this.calculateStreak(userId);

    return {
      totalSessions,
      totalDuration,
      todayDuration,
      weekDuration,
      averageSessionDuration,
      streakDays,
      longestStreak,
    };
  }

  async getHistory(userId: string, page: number, limit: number) {
    const [items, total] = await this.focusRepository.findAndCount({
      where: { user: { id: userId } },
      order: { startTime: 'DESC' },
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

  async getStreak(userId: string) {
    const { streakDays, longestStreak } = await this.calculateStreak(userId);
    return { current: streakDays, longest: longestStreak };
  }

  private async calculateStreak(userId: string): Promise<{ streakDays: number; longestStreak: number }> {
    const sessions = await this.focusRepository
      .createQueryBuilder('session')
      .select('DATE(session.startTime)', 'date')
      .where('session.user.id = :userId', { userId })
      .andWhere('session.isCompleted = :isCompleted', { isCompleted: true })
      .groupBy('DATE(session.startTime)')
      .orderBy('date', 'DESC')
      .getRawMany();

    if (sessions.length === 0) {
      return { streakDays: 0, longestStreak: 0 };
    }

    // 计算最长连续
    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < sessions.length; i++) {
      const prevDate = new Date(sessions[i - 1].date);
      const currDate = new Date(sessions[i].date);
      const diffDays = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // 计算当前连续
    let streakDays = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streakDays) {
        streakDays++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return { streakDays, longestStreak };
  }
}
