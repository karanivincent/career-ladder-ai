import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { Message } from '@career-ladder/shared';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':gameId/messages')
  @ApiOperation({ summary: 'Get all messages for a game' })
  @ApiResponse({ status: 200, description: 'Returns all messages' })
  async getGameMessages(@Param('gameId') gameId: string): Promise<Message[]> {
    return this.chatService.getGameMessages(gameId);
  }

  @Post(':gameId/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get initial AI greeting for a game' })
  @ApiResponse({ status: 200, description: 'Returns initial AI message' })
  async startChat(@Param('gameId') gameId: string): Promise<Message> {
    return this.chatService.getInitialMessage(gameId);
  }

  @Post(':gameId/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message in the game' })
  @ApiResponse({ status: 200, description: 'Message processed and AI response returned' })
  @ApiResponse({ status: 404, description: 'Game not found or not active' })
  async sendMessage(
    @Param('gameId') gameId: string,
    @Body() body: { content: string },
  ): Promise<Message> {
    return this.chatService.processUserMessage(gameId, body.content);
  }
}