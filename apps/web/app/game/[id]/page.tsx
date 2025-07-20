'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { CountdownTimer } from '@/components/game/countdown-timer'
import { ChatInterface } from '@/components/game/chat-interface'
import { GameResults } from '@/components/game/game-results'
import { apiClient } from '@/lib/api/client'
import { MessageRole, Game } from '@career-ladder/shared'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.id as string
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [gameData, setGameData] = useState<Game | null>(null)

  // Load game data on mount
  useEffect(() => {
    const loadGame = async () => {
      try {
        const game = await apiClient.getGame(gameId)
        setGameData(game)
        
        if (game.startedAt) {
          setGameStarted(true)
          // Load existing messages
          const existingMessages = await apiClient.getGameMessages(gameId)
          setMessages(existingMessages.map(msg => ({
            id: msg.id,
            role: msg.role === MessageRole.AI ? 'ai' : 'user',
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          })))
        }
        
        if (game.endedAt) {
          setGameEnded(true)
        }
      } catch (error) {
        console.error('Failed to load game:', error)
        router.push('/game/new')
      }
    }
    
    loadGame()
  }, [gameId, router])

  const startGame = async () => {
    try {
      setIsLoading(true)
      await apiClient.startGame(gameId)
      setGameStarted(true)
      
      // Send initial message to trigger AI response
      const aiResponse = await apiClient.sendMessage(gameId, 'Start game')
      setMessages([{
        id: aiResponse.id,
        role: 'ai',
        content: aiResponse.content,
        timestamp: new Date(aiResponse.timestamp)
      }])
    } catch (error) {
      console.error('Failed to start game:', error)
      const { showErrorToast } = await import('@/lib/api/error-handler')
      showErrorToast(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeUp = async () => {
    setGameEnded(true)
    try {
      // End the game with a timeout
      await apiClient.endGame(gameId, 'Time ran out!', false)
      // Reload game data to get final results
      const updatedGame = await apiClient.getGame(gameId)
      setGameData(updatedGame)
    } catch (error) {
      console.error('Failed to end game:', error)
    }
  }

  const handleSendMessage = async (content: string) => {
    // Add user message optimistically
    const tempUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, tempUserMessage])
    setIsLoading(true)
    
    try {
      // Send to backend and get AI response
      const aiResponse = await apiClient.sendMessage(gameId, content)
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: aiResponse.id,
        role: 'ai',
        content: aiResponse.content,
        timestamp: new Date(aiResponse.timestamp)
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      // Check if game ended
      const gameStatus = await apiClient.getGameStatus(gameId)
      if (gameStatus.status === 'completed') {
        setGameEnded(true)
        // Reload game data to get final results
        const updatedGame = await apiClient.getGame(gameId)
        setGameData(updatedGame)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id))
      const { showErrorToast } = await import('@/lib/api/error-handler')
      showErrorToast(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show results screen when game ends and we have game data
  if (gameEnded && gameData && gameData.endedAt) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <GameResults 
          game={gameData}
          onPlayAgain={() => router.push('/game/new')}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Timer and Game Info Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Career Ladder AI</h2>
            <div className="space-y-4">
              {/* Timer Display */}
              <CountdownTimer
                duration={120}
                isRunning={gameStarted && !gameEnded}
                onTimeUp={handleTimeUp}
              />
              
              {/* Game Status */}
              <div className="space-y-2 text-center">
                <p className="text-sm">
                  <span className="font-semibold">Status:</span>{' '}
                  {gameEnded ? 'Game Over' : gameStarted ? 'In Progress' : 'Ready to Start'}
                </p>
              </div>

              {/* Start Button */}
              {!gameStarted && (
                <Button onClick={startGame} className="w-full" size="lg">
                  Start Game
                </Button>
              )}
            </div>
          </Card>

          {/* Instructions Card */}
          <Card className="p-6">
            <h3 className="font-semibold mb-2">How to Play</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Think of any profession</li>
              <li>• Answer the AI's questions honestly</li>
              <li>• The AI has 2 minutes to guess</li>
              <li>• Have fun with creative questions!</li>
            </ul>
          </Card>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-2 h-[calc(100vh-2rem)]">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!gameStarted || gameEnded}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}