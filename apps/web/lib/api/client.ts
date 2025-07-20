import { Game, CreateGameDto, UpdateGameDto, Message } from '@career-ladder/shared';
import { API_URL } from '@/lib/env';
import { ApiError, handleApiError } from './error-handler';

const API_BASE_URL = API_URL;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new ApiError(
          error.message || `Request failed: ${response.status}`,
          response.status,
          error,
        );
      }

      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Game endpoints
  async createGame(data: CreateGameDto): Promise<Game> {
    return this.request<Game>('/games', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGame(id: string): Promise<Game> {
    return this.request<Game>(`/games/${id}`);
  }

  async startGame(id: string): Promise<Game> {
    return this.request<Game>(`/games/${id}/start`, {
      method: 'POST',
    });
  }

  async endGame(id: string, aiGuess: string, isSuccess: boolean): Promise<Game> {
    return this.request<Game>(`/games/${id}/end`, {
      method: 'POST',
      body: JSON.stringify({ aiGuess, isSuccess }),
    });
  }

  async getGameStatus(id: string): Promise<{ status: string }> {
    return this.request<{ status: string }>(`/games/${id}/status`);
  }

  async getTimeRemaining(id: string): Promise<{ timeRemaining: number }> {
    return this.request<{ timeRemaining: number }>(`/games/${id}/time-remaining`);
  }

  // Chat endpoints
  async getGameMessages(gameId: string): Promise<Message[]> {
    return this.request<Message[]>(`/chat/${gameId}/messages`);
  }

  async startChat(gameId: string): Promise<Message> {
    return this.request<Message>(`/chat/${gameId}/start`, {
      method: 'POST',
    });
  }

  async sendMessage(gameId: string, content: string): Promise<Message> {
    return this.request<Message>(`/chat/${gameId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async saveMessages(
    gameId: string, 
    messages: Array<{ role: string; content: string }>
  ): Promise<{ saved: number }> {
    return this.request<{ saved: number }>(`/chat/${gameId}/messages/save`, {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  }
}

export const apiClient = new ApiClient();