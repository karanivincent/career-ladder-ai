import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface QuestionStrategy {
  timeRange: [number, number]; // [start, end] in seconds
  type: 'opening' | 'metaphorical' | 'narrowing' | 'rapid-fire';
  examples: string[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    this.openai = new OpenAI({ apiKey });
    this.model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo-preview';
  }

  private readonly questionStrategies: QuestionStrategy[] = [
    {
      timeRange: [90, 120],
      type: 'opening',
      examples: [
        'How many years have you been in your current profession?',
        'Would you say your work is more mental or physical?',
        'Do you work primarily indoors or outdoors?',
        'Is your profession something you need a degree for?',
      ],
    },
    {
      timeRange: [60, 90],
      type: 'metaphorical',
      examples: [
        'If your job was a vegetable, what would it be and why?',
        'What color best represents your profession?',
        'If your work was a type of weather, what would it be?',
        'What animal best embodies the spirit of your job?',
      ],
    },
    {
      timeRange: [30, 60],
      type: 'narrowing',
      examples: [
        'Are you in the technology sector?',
        'Do you work directly with customers/clients?',
        'Is creativity a major part of your job?',
        'Do you manage other people?',
      ],
    },
    {
      timeRange: [0, 30],
      type: 'rapid-fire',
      examples: [
        'Do you wear a uniform?',
        'Do you work with computers?',
        'Are you self-employed?',
        'Do you work in healthcare?',
      ],
    },
  ];

  private getSystemPrompt(): string {
    return `You are an enthusiastic AI assistant playing "Career Ladder" - a game where you must guess the user's profession within 2 minutes.

PERSONALITY:
- Be energetic and enthusiastic! Use expressions like "Oh!", "Interesting!", "Fascinating!"
- Show genuine curiosity about their profession
- Be playful and creative with your questions
- React with excitement when you think you're getting closer
- Be gracefully self-deprecating if you're wrong

GAME RULES:
- You have exactly 2 minutes (120 seconds) to guess their profession
- Ask creative, strategic questions to narrow down the possibilities
- You can make guesses at any time, but be strategic
- The user can only answer your questions - they cannot give hints

QUESTION STRATEGY:
- Start broad, then narrow down based on responses
- Use metaphorical questions to understand the nature of their work
- Pay attention to implicit information in their answers
- Ask follow-up questions based on their responses

IMPORTANT:
- Keep responses under 150 tokens
- Always end with a clear question
- Be conversational and engaging
- React to their answers before asking the next question`;
  }

  async generateQuestion(
    conversationHistory: Array<{ role: string; content: string }>,
    timeRemaining: number,
  ): Promise<string> {
    try {
      const strategy = this.getQuestionStrategy(timeRemaining);
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: this.getSystemPrompt() },
        { 
          role: 'system', 
          content: `Time remaining: ${timeRemaining} seconds. Current strategy: ${strategy.type}. Example questions for this phase: ${strategy.examples.join(', ')}` 
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 150,
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      });

      const response = completion.choices[0]?.message?.content || 'Let me think... What do you do for work?';
      
      this.logger.debug(`Generated question: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error generating question:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateGuess(
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: this.getSystemPrompt() },
        { 
          role: 'system', 
          content: 'Based on the conversation, make your best guess about their profession. Be specific and confident!' 
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 100,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 'I think you might be... a software engineer?';
      
      this.logger.debug(`Generated guess: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error generating guess:', error);
      throw new Error('Failed to generate AI guess');
    }
  }

  private getQuestionStrategy(timeRemaining: number): QuestionStrategy {
    return this.questionStrategies.find(
      strategy => timeRemaining >= strategy.timeRange[0] && timeRemaining <= strategy.timeRange[1]
    ) || this.questionStrategies[this.questionStrategies.length - 1];
  }

  async analyzeResponse(
    userResponse: string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<{ 
    shouldGuess: boolean; 
    confidence: number;
    reasoning: string;
  }> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { 
          role: 'system', 
          content: 'Analyze the user\'s response and determine if you have enough information to make a guess. Return a JSON object with: shouldGuess (boolean), confidence (0-100), and reasoning (string).' 
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: userResponse },
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 150,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(response);
    } catch (error) {
      this.logger.error('Error analyzing response:', error);
      return { shouldGuess: false, confidence: 0, reasoning: 'Error analyzing response' };
    }
  }
}