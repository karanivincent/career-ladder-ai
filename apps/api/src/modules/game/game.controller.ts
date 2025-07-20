import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Game, CreateGameDto, UpdateGameDto, GameStatus } from '@career-ladder/shared';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game created successfully' })
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({ status: 200, description: 'Returns all games' })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Game[]> {
    return this.gameService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game by ID' })
  @ApiResponse({ status: 200, description: 'Returns the game' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async findOne(@Param('id') id: string): Promise<Game> {
    return this.gameService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a game' })
  @ApiResponse({ status: 200, description: 'Game updated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<Game> {
    return this.gameService.update(id, updateGameDto);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a game' })
  @ApiResponse({ status: 200, description: 'Game started successfully' })
  @ApiResponse({ status: 400, description: 'Game already ended' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async startGame(@Param('id') id: string): Promise<Game> {
    return this.gameService.startGame(id);
  }

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End a game' })
  @ApiResponse({ status: 200, description: 'Game ended successfully' })
  @ApiResponse({ status: 400, description: 'Game not started or already ended' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async endGame(
    @Param('id') id: string,
    @Body() body: { aiGuess: string; isSuccess: boolean },
  ): Promise<Game> {
    return this.gameService.endGame(id, body.aiGuess, body.isSuccess);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get game status' })
  @ApiResponse({ status: 200, description: 'Returns game status' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async getStatus(@Param('id') id: string): Promise<{ status: GameStatus }> {
    const status = await this.gameService.getGameStatus(id);
    return { status };
  }

  @Get(':id/time-remaining')
  @ApiOperation({ summary: 'Get time remaining in the game' })
  @ApiResponse({ status: 200, description: 'Returns time remaining in seconds' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async getTimeRemaining(@Param('id') id: string): Promise<{ timeRemaining: number }> {
    const timeRemaining = await this.gameService.getTimeRemaining(id);
    return { timeRemaining };
  }
}