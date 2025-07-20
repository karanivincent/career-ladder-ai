import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface MessageProps {
  role: 'user' | 'ai'
  content: string
  timestamp?: Date
  className?: string
}

export function Message({ role, content, timestamp, className }: MessageProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse', className)}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        'flex flex-col gap-1',
        isUser && 'items-end'
      )}>
        <div className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        )}>
          <p className="text-sm">{content}</p>
        </div>
        
        {timestamp && (
          <span className="text-xs text-muted-foreground px-1">
            {new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </div>
  )
}