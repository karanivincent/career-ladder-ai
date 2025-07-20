'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Message } from './message'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  disabled?: boolean
  gameStarted?: boolean
  className?: string
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  disabled = false,
  gameStarted = false,
  className 
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || disabled || isLoading) return
    
    onSendMessage(input.trim())
    setInput('')
  }

  const quickResponses = ['Yes', 'No', 'Maybe', 'Sort of', 'Not really']

  const handleQuickResponse = (response: string) => {
    if (disabled || isLoading) return
    onSendMessage(response)
  }

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Chat with AI</h3>
          {isLoading && (
            <Badge variant="secondary" className="animate-pulse">
              AI is thinking...
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>{gameStarted ? 'Loading conversation...' : 'Click "Start Game" to begin'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick Responses */}
      {!disabled && messages.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response) => (
              <Button
                key={response}
                variant="outline"
                size="sm"
                onClick={() => handleQuickResponse(response)}
                disabled={isLoading}
              >
                {response}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Game not started" : "Type your answer..."}
            disabled={disabled || isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={disabled || isLoading || !input.trim()}
          >
            Send
          </Button>
        </div>
      </form>
    </Card>
  )
}