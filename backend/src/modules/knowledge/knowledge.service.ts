import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between, MoreThan } from 'typeorm';
import { Knowledge } from './knowledge.entity';
import { Tag } from './tag.entity';
import { CreateKnowledgeDto, UpdateKnowledgeDto, KnowledgeQueryDto, ImportFromUrlDto } from './dto/knowledge.dto';
import { AiService } from '../ai/ai.service';
import { MemoryAlgorithmService } from '../review/memory-algorithm.service';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private knowledgeRepository: Repository<Knowledge>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private aiService: AiService,
    private memoryAlgorithm: MemoryAlgorithmService,
  ) {}

  async create(userId: string, createDto: CreateKnowledgeDto) {
    const { tagIds, ...knowledgeData } = createDto;

    // 创建知识点
    const knowledge = this.knowledgeRepository.create({
      ...knowledgeData,
      user: { id: userId },
    });

    // 处理标签
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.findByIds(tagIds);
      knowledge.tags = tags;
    }

    // AI 提炼核心要点
    const extracted = await this.aiService.extractKeyPoints(createDto.content);
    knowledge.aiSummary = extracted.summary;
    knowledge.aiKeywords = extracted.keywords;

    // 设置首次复习时间（艾宾浩斯：1天后）
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    knowledge.nextReviewDate = tomorrow;

    await this.knowledgeRepository.save(knowledge);
    return knowledge;
  }

  async findAll(userId: string, query: KnowledgeQueryDto) {
    const { tagId, search, page = 1, limit = 20 } = query;

    const qb = this.knowledgeRepository
      .createQueryBuilder('knowledge')
      .leftJoinAndSelect('knowledge.tags', 'tag')
      .where('knowledge.user.id = :userId', { userId });

    if (tagId) {
      qb.andWhere('tag.id = :tagId', { tagId });
    }

    if (search) {
      qb.andWhere(
        '(knowledge.title ILIKE :search OR knowledge.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('knowledge.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const knowledge = await this.knowledgeRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['tags', 'reviews'],
    });

    if (!knowledge) {
      throw new NotFoundException('知识点不存在');
    }

    return knowledge;
  }

  async update(id: string, userId: string, updateDto: UpdateKnowledgeDto) {
    const knowledge = await this.findOne(id, userId);
    Object.assign(knowledge, updateDto);
    await this.knowledgeRepository.save(knowledge);
    return knowledge;
  }

  async remove(id: string, userId: string) {
    const knowledge = await this.findOne(id, userId);
    await this.knowledgeRepository.remove(knowledge);
    return { message: '删除成功' };
  }

  async importFromUrl(userId: string, importDto: ImportFromUrlDto) {
    // TODO: 实现网页抓取和内容提取
    // 这里可以使用 puppeteer 或其他工具
    const mockContent = {
      title: '从 URL 导入的内容',
      content: '待实现网页抓取功能',
    };

    return this.create(userId, {
      title: mockContent.title,
      content: mockContent.content,
      sourceUrl: importDto.url,
      tagIds: importDto.tagIds,
    });
  }

  async getMindmap(id: string, userId: string) {
    const knowledge = await this.findOne(id, userId);

    if (!knowledge.mindmap) {
      knowledge.mindmap = await this.aiService.generateMindmap(knowledge.content);
      await this.knowledgeRepository.save(knowledge);
    }

    return knowledge.mindmap;
  }

  async getTodayKnowledge(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.knowledgeRepository
      .createQueryBuilder('knowledge')
      .where('knowledge.user.id = :userId', { userId })
      .andWhere('knowledge.nextReviewDate <= :today', { today })
      .orderBy('knowledge.easeFactor', 'ASC')
      .getMany();
  }

  async getStats(userId: string) {
    const total = await this.knowledgeRepository.count({
      where: { user: { id: userId } },
    });

    const mastered = await this.knowledgeRepository.count({
      where: { user: { id: userId }, easeFactor: MoreThanOrEqual(2.3) },
    });

    const learning = await this.knowledgeRepository.count({
      where: {
        user: { id: userId },
        easeFactor: Between(1.5, 2.3),
        reviewCount: MoreThan(2),
      },
    });

    const newKnowledge = await this.knowledgeRepository.count({
      where: { user: { id: userId }, reviewCount: 0 },
    });

    return { total, mastered, learning, newKnowledge };
  }
}
