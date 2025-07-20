import { Game, CreateGameDto, UpdateGameDto, Message } from '@career-ladder/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
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

  async sendMessage(gameId: string, content: string): Promise<Message> {
    return this.request<Message>(`/chat/${gameId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

export const apiClient = new ApiClient();