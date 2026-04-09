import { create } from 'zustand';
import { User, Knowledge, FocusSession, ReviewStats, FocusStats } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUser, mockKnowledgeList, mockReviewStats, mockFocusStats, mockTodayReviews } from '../services/mockData';

// ==================== 认证状态 ====================
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    // Mock 登录
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ user: mockUser, isAuthenticated: true });
  },

  register: async (email, password, name) => {
    // Mock 注册
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ user: { ...mockUser, name, email }, isAuthenticated: true });
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    // Mock: 自动登录
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },
}));

// ==================== 知识状态 ====================
interface KnowledgeState {
  knowledgeList: Knowledge[];
  todayKnowledge: Knowledge[];
  isLoading: boolean;
  fetchKnowledgeList: (params?: any) => Promise<void>;
  fetchTodayKnowledge: () => Promise<void>;
  addKnowledge: (data: any) => Promise<void>;
  updateKnowledge: (id: string, data: any) => Promise<void>;
  deleteKnowledge: (id: string) => Promise<void>;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  knowledgeList: [],
  todayKnowledge: [],
  isLoading: false,

  fetchKnowledgeList: async (params) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ knowledgeList: mockKnowledgeList, isLoading: false });
  },

  fetchTodayKnowledge: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({ todayKnowledge: mockTodayReviews });
  },

  addKnowledge: async (data) => {
    const newKnowledge: Knowledge = {
      id: Date.now().toString(),
      ...data,
      understandingLevel: 1,
      reviewCount: 0,
      nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ knowledgeList: [newKnowledge, ...get().knowledgeList] });
  },

  updateKnowledge: async (id, data) => {
    set({
      knowledgeList: get().knowledgeList.map((k) =>
        k.id === id ? { ...k, ...data } : k
      ),
    });
  },

  deleteKnowledge: async (id) => {
    set({
      knowledgeList: get().knowledgeList.filter((k) => k.id !== id),
    });
  },
}));

// ==================== 专注状态 ====================
interface FocusState {
  currentSession: FocusSession | null;
  isRunning: boolean;
  timeLeft: number;
  stats: FocusStats | null;
  startSession: (plannedDuration: number, knowledgeId?: string) => Promise<void>;
  endSession: (notes?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  tick: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  currentSession: null,
  isRunning: false,
  timeLeft: 25 * 60,
  stats: null,

  startSession: async (plannedDuration, knowledgeId) => {
    const session: FocusSession = {
      id: Date.now().toString(),
      plannedDuration,
      knowledgeId,
      startTime: new Date().toISOString(),
      duration: 0,
      isCompleted: false,
    };
    set({
      currentSession: session,
      isRunning: true,
      timeLeft: plannedDuration * 60,
    });
  },

  endSession: async (notes) => {
    const { currentSession } = get();
    if (currentSession) {
      set({ currentSession: null, isRunning: false, timeLeft: 25 * 60 });
    }
  },

  fetchStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({ stats: mockFocusStats });
  },

  tick: () => {
    const { timeLeft, isRunning } = get();
    if (isRunning && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    }
  },
}));

// ==================== 复习状态 ====================
interface ReviewState {
  todayReviews: Knowledge[];
  stats: ReviewStats | null;
  currentReviewIndex: number;
  fetchTodayReviews: () => Promise<void>;
  fetchStats: () => Promise<void>;
  submitReview: (knowledgeId: string, score: number) => Promise<void>;
  nextReview: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  todayReviews: [],
  stats: null,
  currentReviewIndex: 0,

  fetchTodayReviews: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ todayReviews: [...mockTodayReviews], currentReviewIndex: 0 });
  },

  fetchStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({ stats: mockReviewStats });
  },

  submitReview: async (knowledgeId, score) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const { todayReviews } = get();
    set({
      todayReviews: todayReviews.filter((k) => k.id !== knowledgeId),
    });
  },

  nextReview: () => {
    set({ currentReviewIndex: get().currentReviewIndex + 1 });
  },
}));
