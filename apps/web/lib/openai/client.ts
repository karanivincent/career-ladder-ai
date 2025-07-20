import OpenAI from 'openai'
import { MessageRole } from '@career-ladder/shared'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

class OpenAIClient {
  private openai: OpenAI | null = null
  private model = 'gpt-4-turbo-preview'

  initialize(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Required for browser usage
    })
  }

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
- React to their answers before asking the next question`
  }

  private getQuestionStrategy(timeRemaining: number) {
    if (timeRemaining > 90) return 'opening'
    if (timeRemaining > 60) return 'metaphorical'
    if (timeRemaining > 30) return 'narrowing'
    return 'rapid-fire'
  }

  async generateResponse(
    conversationHistory: ConversationMessage[],
    timeRemaining: number
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized')
    }

    try {
      const strategy = this.getQuestionStrategy(timeRemaining)
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: this.getSystemPrompt() },
        { 
          role: 'system', 
          content: `Time remaining: ${timeRemaining} seconds. Current strategy: ${strategy}.` 
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ]

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 150,
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      })

      return completion.choices[0]?.message?.content || 'Let me think... What do you do for work?'
    } catch (error) {
      console.error('Error generating AI response:', error)
      throw new Error('Failed to generate AI response')
    }
  }

  async generateGuess(conversationHistory: ConversationMessage[]): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized')
    }

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
      ]

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 100,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || 'I think you might be... a software engineer?'
    } catch (error) {
      console.error('Error generating guess:', error)
      throw new Error('Failed to generate AI guess')
    }
  }
}

export const openAIClient = new OpenAIClient()