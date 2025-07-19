export interface Game {
  id: string;
  profession: string;
  aiGuess?: string;
  isSuccess: boolean;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGameDto {
  profession: string;
}

export interface UpdateGameDto {
  aiGuess?: string;
  isSuccess?: boolean;
  endedAt?: Date;
  duration?: number;
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}