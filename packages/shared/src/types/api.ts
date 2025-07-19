import { Message } from './message';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AiQuestionRequest {
  gameId: string;
  conversationHistory: Message[];
  timeRemaining: number;
}

export interface AiQuestionResponse {
  question: string;
  strategy: string;
  confidence?: number;
}