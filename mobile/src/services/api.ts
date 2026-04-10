import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User, Knowledge, ReviewStats, FocusStats, PaginatedResponse } from '../types';

// 开发环境用 Render，生产环境用阿里云
const API_BASE_URL = __DEV__ 
  ? 'https://neihua.onrender.com/api' 
  : 'http://59.110.5.24/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器：添加 token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器：处理错误
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token 过期，尝试刷新
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.api.post('/auth/refresh', { refreshToken });
              const { accessToken, refreshToken: newRefreshToken } = response.data;
              await AsyncStorage.setItem('accessToken', accessToken);
              await AsyncStorage.setItem('refreshToken', newRefreshToken);
              // 重试原请求
              error.config!.headers.Authorization = `Bearer ${accessToken}`;
              return this.api.request(error.config!);
            } catch (refreshError) {
              // 刷新失败，清除 token
              await AsyncStorage.removeItem('accessToken');
              await AsyncStorage.removeItem('refreshToken');
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== 认证 ====================

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', { email, password, name });
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // ==================== 知识点 ====================

  async getKnowledgeList(params?: {
    tagId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Knowledge>> {
    const response = await this.api.get('/knowledge', { params });
    return response.data;
  }

  async getKnowledge(id: string): Promise<Knowledge> {
    const response = await this.api.get(`/knowledge/${id}`);
    return response.data;
  }

  async createKnowledge(data: {
    title: string;
    content: string;
    sourceUrl?: string;
    tagIds?: string[];
    userReflection?: string;
  }): Promise<Knowledge> {
    const response = await this.api.post('/knowledge', data);
    return response.data;
  }

  async updateKnowledge(id: string, data: Partial<Knowledge>): Promise<Knowledge> {
    const response = await this.api.put(`/knowledge/${id}`, data);
    return response.data;
  }

  async deleteKnowledge(id: string): Promise<void> {
    await this.api.delete(`/knowledge/${id}`);
  }

  async getTodayKnowledge(): Promise<Knowledge[]> {
    const response = await this.api.get('/knowledge/today');
    return response.data;
  }

  // ==================== 复习 ====================

  async getTodayReviews(): Promise<{ total: number; items: Knowledge[] }> {
    const response = await this.api.get('/review/today');
    return response.data;
  }

  async submitReview(data: {
    knowledgeId: string;
    score: number;
    userAnswer?: string;
    duration?: number;
  }): Promise<any> {
    const response = await this.api.post('/review/submit', data);
    return response.data;
  }

  async getReviewStats(): Promise<ReviewStats> {
    const response = await this.api.get('/review/stats');
    return response.data;
  }

  async getReviewCalendar(days?: number): Promise<Record<string, number>> {
    const response = await this.api.get('/review/calendar', { params: { days } });
    return response.data;
  }

  // ==================== 专注 ====================

  async startFocusSession(data: {
    plannedDuration?: number;
    knowledgeId?: string;
    backgroundSound?: string;
  }): Promise<any> {
    const response = await this.api.post('/focus/start', data);
    return response.data;
  }

  async endFocusSession(id: string, data: {
    notes?: string;
    distractions?: string;
    isCompleted?: boolean;
  }): Promise<any> {
    const response = await this.api.put(`/focus/${id}/end`, data);
    return response.data;
  }

  async getFocusStats(): Promise<FocusStats> {
    const response = await this.api.get('/focus/stats');
    return response.data;
  }

  async getFocusHistory(page?: number, limit?: number): Promise<PaginatedResponse<any>> {
    const response = await this.api.get('/focus/history', { params: { page, limit } });
    return response.data;
  }
}

export const apiService = new ApiService();
