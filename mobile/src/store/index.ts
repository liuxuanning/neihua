import { create } from 'zustand';
import { User, Knowledge, FocusSession, ReviewStats, FocusStats } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

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
    const response = await apiService.login(email, password);
    await AsyncStorage.setItem('accessToken', response.accessToken);
    await AsyncStorage.setItem('refreshToken', response.refreshToken);
    set({ user: response.user, isAuthenticated: true });
  },

  register: async (email, password, name) => {
    const response = await apiService.register(email, password, name);
    await AsyncStorage.setItem('accessToken', response.accessToken);
    await AsyncStorage.setItem('refreshToken', response.refreshToken);
    set({ user: response.user, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const user = await apiService.getProfile();
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
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
    try {
      const response = await apiService.getKnowledgeList(params);
      set({ knowledgeList: response.items, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchTodayKnowledge: async () => {
    try {
      const items = await apiService.getTodayKnowledge();
      set({ todayKnowledge: items });
    } catch (error) {
      console.error('获取今日知识失败', error);
    }
  },

  addKnowledge: async (data) => {
    const knowledge = await apiService.createKnowledge(data);
    set({ knowledgeList: [knowledge, ...get().knowledgeList] });
  },

  updateKnowledge: async (id, data) => {
    const knowledge = await apiService.updateKnowledge(id, data);
    set({
      knowledgeList: get().knowledgeList.map((k) =>
        k.id === id ? knowledge : k
      ),
    });
  },

  deleteKnowledge: async (id) => {
    await apiService.deleteKnowledge(id);
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
    const session = await apiService.startFocusSession({
      plannedDuration,
      knowledgeId,
    });
    set({
      currentSession: session,
      isRunning: true,
      timeLeft: plannedDuration * 60,
    });
  },

  endSession: async (notes) => {
    const { currentSession } = get();
    if (currentSession) {
      await apiService.endFocusSession(currentSession.id, {
        notes,
        isCompleted: true,
      });
      set({ currentSession: null, isRunning: false, timeLeft: 25 * 60 });
    }
  },

  fetchStats: async () => {
    const stats = await apiService.getFocusStats();
    set({ stats });
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
    const response = await apiService.getTodayReviews();
    set({ todayReviews: response.items, currentReviewIndex: 0 });
  },

  fetchStats: async () => {
    const stats = await apiService.getReviewStats();
    set({ stats });
  },

  submitReview: async (knowledgeId, score) => {
    await apiService.submitReview({ knowledgeId, score });
    const { todayReviews } = get();
    set({
      todayReviews: todayReviews.filter((k) => k.id !== knowledgeId),
    });
  },

  nextReview: () => {
    set({ currentReviewIndex: get().currentReviewIndex + 1 });
  },
}));
