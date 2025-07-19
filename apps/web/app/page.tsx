export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Career Ladder AI</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Can AI guess your profession in 2 minutes?
        </p>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Start Game
        </button>
      </div>
    </main>
  )
}