'use client'

import { useEffect, useState, useCallback } from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  duration: number // Duration in seconds
  onTimeUp: () => void
  isRunning: boolean
  className?: string
}

export function CountdownTimer({ duration, onTimeUp, isRunning, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration)
      setProgress(100)
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, duration, onTimeUp])

  useEffect(() => {
    setProgress((timeLeft / duration) * 100)
  }, [timeLeft, duration])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const getTimerColor = useCallback(() => {
    if (progress > 50) return 'text-green-600'
    if (progress > 25) return 'text-yellow-600'
    return 'text-red-600 animate-pulse'
  }, [progress])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        {/* Circular Timer */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className={cn('transition-all duration-1000', getTimerColor())}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Timer Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn('text-4xl font-mono font-bold', getTimerColor())}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {timeLeft > 60 ? 'Time Remaining' : 'Hurry Up!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Start</span>
          <span>{Math.round(progress)}%</span>
          <span>Time's Up</span>
        </div>
      </div>

      {/* Time Milestones */}
      {isRunning && (
        <div className="text-center text-sm">
          {timeLeft === 90 && (
            <p className="text-yellow-600 animate-in fade-in duration-500">
              90 seconds remaining - Time to narrow down!
            </p>
          )}
          {timeLeft === 60 && (
            <p className="text-yellow-600 animate-in fade-in duration-500">
              1 minute left - Getting closer!
            </p>
          )}
          {timeLeft === 30 && (
            <p className="text-orange-600 animate-in fade-in duration-500">
              30 seconds - Final guesses!
            </p>
          )}
          {timeLeft === 10 && (
            <p className="text-red-600 animate-pulse">
              10 seconds - Last chance!
            </p>
          )}
        </div>
      )}
    </div>
  )
}