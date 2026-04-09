import { Knowledge, User, ReviewStats, FocusStats } from '../types';

// Mock 用户数据
export const mockUser: User = {
  id: '1',
  email: 'demo@neihua.app',
  name: '学习者小明',
  avatar: undefined,
  isPro: false,
};

// Mock 知识点数据
export const mockKnowledgeList: Knowledge[] = [
  {
    id: '1',
    title: '费曼学习法的核心要点',
    content: '费曼学习法是一种高效的学习方法，核心理念是：如果你不能简单地解释某件事，说明你还没有真正理解它。具体步骤包括：1. 选择一个概念；2. 用简单的语言向他人解释；3. 识别知识盲点；4. 回顾并简化。',
    aiSummary: '费曼学习法四步骤：选择概念→简单解释→识别盲点→回顾简化，核心是用输出倒逼输入。',
    aiKeywords: ['费曼学习法', '主动学习', '知识内化', '输出倒逼输入'],
    understandingLevel: 3,
    reviewCount: 2,
    nextReviewDate: new Date().toISOString(),
    tags: [
      { id: 't1', name: '学习方法', color: '#6366F1' },
      { id: 't2', name: '认知', color: '#F59E0B' },
    ],
    createdAt: '2026-04-07T10:00:00Z',
    updatedAt: '2026-04-07T10:00:00Z',
  },
  {
    id: '2',
    title: '艾宾浩斯遗忘曲线原理',
    content: '德国心理学家艾宾浩斯研究发现，遗忘在学习之后立即开始，且遗忘的进程不是均匀的。最初遗忘速度很快，以后逐渐缓慢。他认为"保持和遗忘是时间的函数"，并根据实验数据绘出了著名的艾宾浩斯记忆遗忘曲线。',
    aiSummary: '遗忘曲线表明：遗忘先快后慢，学习后需及时复习才能高效记忆。',
    aiKeywords: ['艾宾浩斯', '遗忘曲线', '记忆规律', '间隔复习'],
    understandingLevel: 4,
    reviewCount: 5,
    nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
    tags: [
      { id: 't3', name: '记忆', color: '#10B981' },
    ],
    createdAt: '2026-04-05T14:30:00Z',
    updatedAt: '2026-04-08T09:00:00Z',
  },
  {
    id: '3',
    title: '番茄工作法的25分钟原理',
    content: '番茄工作法由弗朗西斯科·西里洛创立，核心是将工作分解为25分钟的专注时段，每段之后休息5分钟。4个番茄时段后，休息15-30分钟。25分钟是基于人注意力集中时长的最佳平衡点，既不会太长导致疲劳，也不会太短影响深度思考。',
    aiSummary: '番茄工作法：25分钟专注+5分钟休息，4轮后长休息，符合注意力规律。',
    aiKeywords: ['番茄钟', '专注力', '时间管理', '工作效率'],
    understandingLevel: 2,
    reviewCount: 1,
    nextReviewDate: new Date().toISOString(),
    tags: [
      { id: 't4', name: '效率', color: '#EF4444' },
      { id: 't3', name: '记忆', color: '#10B981' },
    ],
    createdAt: '2026-04-08T16:00:00Z',
    updatedAt: '2026-04-08T16:00:00Z',
  },
  {
    id: '4',
    title: '第一性原理思维',
    content: '第一性原理是一种思维模型，源自物理学。它要求将问题拆解到最基本的事实和假设，然后从这些基础重新构建解决方案。与类比思维不同，第一性原理不依赖过往经验，而是从根本出发思考。马斯克是这种思维的典型实践者。',
    aiSummary: '第一性原理：拆解到基本事实，从零重构，而非类比模仿。',
    aiKeywords: ['第一性原理', '思维模型', '创新思维', '马斯克'],
    understandingLevel: 5,
    reviewCount: 8,
    nextReviewDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    tags: [
      { id: 't5', name: '思维', color: '#8B5CF6' },
    ],
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-08T11:00:00Z',
  },
  {
    id: '5',
    title: '元认知能力：学会如何学习',
    content: '元认知是指"关于认知的认知"，即对自己的思维过程进行监控和调节的能力。具备强元认知能力的人能够：知道自己知道什么、不知道什么；选择合适的学习策略；监控自己的理解程度；及时调整学习方法。这是最高阶的学习能力。',
    aiSummary: '元认知是"认知的认知"，让你监控调节自己的学习过程，是最高阶学习能力。',
    aiKeywords: ['元认知', '学习能力', '自我调节', '认知升级'],
    understandingLevel: 3,
    reviewCount: 3,
    nextReviewDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    tags: [
      { id: 't2', name: '认知', color: '#F59E0B' },
      { id: 't1', name: '学习方法', color: '#6366F1' },
    ],
    createdAt: '2026-04-06T13:00:00Z',
    updatedAt: '2026-04-07T15:30:00Z',
  },
];

// Mock 复习统计
export const mockReviewStats: ReviewStats = {
  totalReviews: 19,
  todayReviews: 2,
  streakDays: 7,
  averageScore: 3.8,
  knowledgeMastered: 1,
  knowledgeLearning: 3,
  knowledgeNew: 1,
};

// Mock 专注统计
export const mockFocusStats: FocusStats = {
  totalSessions: 42,
  totalDuration: 840,
  todayDuration: 75,
  weekDuration: 320,
  averageSessionDuration: 20,
  streakDays: 5,
  longestStreak: 12,
};

// Mock 今日待复习
export const mockTodayReviews = mockKnowledgeList.filter(
  (k) => new Date(k.nextReviewDate) <= new Date()
);
