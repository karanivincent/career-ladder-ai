import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Game } from '@career-ladder/shared'
import { cn } from '@/lib/utils'

interface GameResultsProps {
  game: Game
  onPlayAgain?: () => void
  className?: string
}

export function GameResults({ game, onPlayAgain, className }: GameResultsProps) {
  const isSuccess = game.isSuccess
  const duration = game.duration || 0
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">
          {isSuccess ? '🎉 Congratulations!' : '⏰ Time\'s Up!'}
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          {isSuccess 
            ? 'The AI successfully guessed your profession!' 
            : 'The AI couldn\'t guess your profession in time.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Result Summary */}
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Your Profession:</span>
            <Badge variant="outline" className="text-base">
              {game.profession}
            </Badge>
          </div>
          
          {game.aiGuess && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">AI's Guess:</span>
              <Badge 
                variant={isSuccess ? 'default' : 'secondary'} 
                className="text-base"
              >
                {game.aiGuess}
              </Badge>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Time Taken:</span>
            <span className="font-mono">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Result:</span>
            <Badge 
              variant={isSuccess ? 'default' : 'destructive'}
              className={cn(
                'text-base',
                isSuccess ? 'bg-green-600' : 'bg-red-600'
              )}
            >
              {isSuccess ? 'AI Wins!' : 'You Win!'}
            </Badge>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="space-y-2">
          <h4 className="font-semibold">Game Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-muted-foreground">Questions Asked</p>
              <p className="text-xl font-bold">
                {Math.floor(duration / 15)} {/* Rough estimate */}
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-muted-foreground">Difficulty</p>
              <p className="text-xl font-bold">
                {isSuccess ? 'Easy' : 'Hard'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={onPlayAgain || (() => window.location.href = '/game/new')}
            className="flex-1"
            size="lg"
          >
            Play Again
          </Button>
          
          <Link href="/" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Share Section */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Share your result with friends!
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const text = `I just played Career Ladder AI! The AI ${
                  isSuccess ? 'successfully guessed' : 'failed to guess'
                } that I'm a ${game.profession} in ${minutes}:${seconds.toString().padStart(2, '0')}! Can you stump the AI?`
                
                navigator.clipboard.writeText(text)
                alert('Result copied to clipboard!')
              }}
            >
              Copy Result
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}