export enum MessageRole {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

export interface Message {
  id: string;
  gameId: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  createdAt: Date;
}

export interface CreateMessageDto {
  gameId: string;
  role: MessageRole;
  content: string;
}