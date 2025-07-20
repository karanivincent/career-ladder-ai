import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { GameService } from '../game/game.service';
import { Message, CreateMessageDto, MessageRole } from '@career-ladder/shared';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private gameService: GameService,
  ) {}

  async createMessage(data: CreateMessageDto): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        gameId: data.gameId,
        role: data.role,
        content: data.content,
        timestamp: new Date(),
      },
    });

    return this.mapToMessage(message);
  }

  async getGameMessages(gameId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { gameId },
      orderBy: { timestamp: 'asc' },
    });

    return messages.map(msg => this.mapToMessage(msg));
  }

  async processUserMessage(gameId: string, content: string): Promise<Message> {
    // Verify game exists and is active
    const game = await this.gameService.findOne(gameId);
    const gameStatus = await this.gameService.getGameStatus(gameId);
    
    if (gameStatus !== 'in_progress') {
      throw new NotFoundException('Game is not active');
    }

    // Save user message
    const userMessage = await this.createMessage({
      gameId,
      role: MessageRole.USER,
      content,
    });

    // Get conversation history
    const messages = await this.getGameMessages(gameId);
    const conversationHistory = messages.map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Get time remaining
    const timeRemaining = await this.gameService.getTimeRemaining(gameId);

    // Analyze if AI should make a guess
    const analysis = await this.aiService.analyzeResponse(content, conversationHistory);

    let aiResponse: string;
    
    if (analysis.shouldGuess && analysis.confidence > 70) {
      // AI is confident enough to make a guess
      aiResponse = await this.aiService.generateGuess(conversationHistory);
      
      // Check if the guess is correct (simplified - in real app, this would be more sophisticated)
      const isCorrect = this.checkGuess(aiResponse, game.profession);
      
      if (isCorrect || timeRemaining < 10) {
        // End the game
        await this.gameService.endGame(gameId, aiResponse, isCorrect);
      }
    } else {
      // Generate next question
      aiResponse = await this.aiService.generateQuestion(conversationHistory, timeRemaining);
    }

    // Save AI response
    const aiMessage = await this.createMessage({
      gameId,
      role: MessageRole.AI,
      content: aiResponse,
    });

    return aiMessage;
  }

  private checkGuess(guess: string, actualProfession: string): boolean {
    // Simple check - in production, this would be more sophisticated
    // Could use embeddings or fuzzy matching
    const normalizedGuess = guess.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedProfession = actualProfession.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return normalizedGuess.includes(normalizedProfession) || 
           normalizedProfession.includes(normalizedGuess);
  }

  private mapToMessage(message: any): Message {
    return {
      id: message.id,
      gameId: message.gameId,
      role: message.role as MessageRole,
      content: message.content,
      timestamp: message.timestamp,
      createdAt: message.createdAt,
    };
  }
}