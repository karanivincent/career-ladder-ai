import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { Game, CreateGameDto, UpdateGameDto, GameStatus } from '@career-ladder/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(data: CreateGameDto): Promise<Game> {
    const game = await this.prisma.game.create({
      data: {
        profession: data.profession,
        isSuccess: false,
      },
    });

    return this.mapToGame(game);
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return this.mapToGame(game);
  }

  async findAll(limit = 20, offset = 0): Promise<Game[]> {
    const games = await this.prisma.game.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return games.map(game => this.mapToGame(game));
  }

  async update(id: string, data: UpdateGameDto): Promise<Game> {
    try {
      const game = await this.prisma.game.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return this.mapToGame(game);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Game with ID ${id} not found`);
      }
      throw error;
    }
  }

  async startGame(id: string): Promise<Game> {
    const game = await this.findOne(id);
    
    if (game.startedAt && game.endedAt) {
      throw new BadRequestException('Game has already ended');
    }

    // Update startedAt directly since it's not part of UpdateGameDto
    const updatedGame = await this.prisma.game.update({
      where: { id },
      data: {
        startedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.mapToGame(updatedGame);
  }

  async endGame(id: string, aiGuess: string, isSuccess: boolean): Promise<Game> {
    const game = await this.findOne(id);
    
    if (game.endedAt) {
      throw new BadRequestException('Game has already ended');
    }

    if (!game.startedAt) {
      throw new BadRequestException('Game has not started yet');
    }

    const endedAt = new Date();
    const duration = Math.floor((endedAt.getTime() - new Date(game.startedAt).getTime()) / 1000);

    return this.update(id, {
      aiGuess,
      isSuccess,
      endedAt,
      duration,
    });
  }

  async getGameStatus(id: string): Promise<GameStatus> {
    const game = await this.findOne(id);

    if (!game.startedAt) {
      return GameStatus.WAITING;
    }

    if (game.endedAt) {
      return GameStatus.COMPLETED;
    }

    // Check if game has been abandoned (no activity for 5 minutes)
    const lastActivity = game.updatedAt || game.startedAt;
    const inactiveTime = Date.now() - new Date(lastActivity).getTime();
    if (inactiveTime > 5 * 60 * 1000) {
      return GameStatus.ABANDONED;
    }

    return GameStatus.IN_PROGRESS;
  }

  async getTimeRemaining(id: string): Promise<number> {
    const game = await this.findOne(id);

    if (!game.startedAt || game.endedAt) {
      return 0;
    }

    const elapsed = Math.floor((Date.now() - new Date(game.startedAt).getTime()) / 1000);
    const remaining = Math.max(0, 120 - elapsed); // 2 minutes game time

    return remaining;
  }

  private mapToGame(game: any): Game {
    return {
      id: game.id,
      profession: game.profession,
      aiGuess: game.aiGuess,
      isSuccess: game.isSuccess,
      startedAt: game.startedAt,
      endedAt: game.endedAt,
      duration: game.duration,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }
}