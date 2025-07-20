import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Career Ladder AI</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Can AI guess your profession in 2 minutes?
        </p>
        <Link href="/game/new">
          <Button size="lg" className="text-lg px-8">
            Start Game
          </Button>
        </Link>
      </div>
    </main>
  )
}