// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPro: boolean;
}

// 知识点相关类型
export interface Knowledge {
  id: string;
  title: string;
  content: string;
  sourceUrl?: string;
  sourceTitle?: string;
  aiSummary?: string;
  aiKeywords?: string[];
  userReflection?: string;
  understandingLevel: number;
  reviewCount: number;
  nextReviewDate?: string;
  lastReviewDate?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

// 复习相关类型
export interface Review {
  id: string;
  knowledgeId: string;
  reviewDate: string;
  score: number;
  interval: number;
  easeFactor: number;
  nextReviewDate: string;
  userAnswer?: string;
  aiFeedback?: string;
}

export interface ReviewStats {
  totalReviews: number;
  todayReviews: number;
  streakDays: number;
  averageScore: number;
  knowledgeMastered: number;
  knowledgeLearning: number;
  knowledgeNew: number;
}

// 专注相关类型
export interface FocusSession {
  id: string;
  knowledgeId?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  plannedDuration: number;
  isCompleted: boolean;
  backgroundSound?: string;
  notes?: string;
}

export interface FocusStats {
  totalSessions: number;
  totalDuration: number;
  todayDuration: number;
  weekDuration: number;
  averageSessionDuration: number;
  streakDays: number;
  longestStreak: number;
}

// 认证相关类型
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
