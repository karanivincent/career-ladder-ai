'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewGamePage() {
  const router = useRouter()
  const [profession, setProfession] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateGame = async () => {
    if (!profession.trim()) return

    setIsCreating(true)
    
    try {
      // Import the API client
      const { apiClient } = await import('@/lib/api/client')
      
      // Create game in the database
      const game = await apiClient.createGame({ profession })
      
      // Navigate to the game page
      router.push(`/game/${game.id}`)
    } catch (error) {
      console.error('Failed to create game:', error)
      const { showErrorToast } = await import('@/lib/api/error-handler')
      showErrorToast(error)
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Start a New Game</CardTitle>
          <CardDescription className="text-lg mt-2">
            Think of any profession, and our AI will try to guess it!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="profession" className="text-sm font-medium">
              Your Profession
            </label>
            <Input
              id="profession"
              type="text"
              placeholder="e.g., Software Engineer, Chef, Teacher..."
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateGame()
                }
              }}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Don't worry, the AI won't see this directly. It will have to guess through questions!
            </p>
          </div>

          <Button 
            onClick={handleCreateGame} 
            disabled={!profession.trim() || isCreating}
            className="w-full"
            size="lg"
          >
            {isCreating ? 'Creating Game...' : 'Start Game'}
          </Button>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Game Rules:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• The AI has 2 minutes to guess your profession</li>
              <li>• Answer questions honestly for the best experience</li>
              <li>• The AI might ask creative or metaphorical questions</li>
              <li>• You can answer with Yes, No, or provide details</li>
              <li>• Have fun and see if the AI can figure it out!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}