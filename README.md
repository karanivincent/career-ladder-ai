# Career Ladder AI

An interactive game where an AI assistant attempts to guess users' professions through creative questioning within a 2-minute time limit.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: NestJS + Prisma
- **Database**: Supabase (PostgreSQL + Realtime + Auth)
- **AI**: OpenAI GPT-4 or Claude API

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Supabase CLI
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd career-ladder-ai

# Install dependencies
npm install

# Start local Supabase
npx supabase start

# Setup environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

## Development

```bash
# Start both frontend and backend
npm run dev

# Start frontend only (port 3000)
npm run dev:web

# Start backend only (port 3001)
npm run dev:api

# Run tests
npm run test

# Format code
npm run format

# Run linting
npm run lint
```

## Project Structure

```
apps/
  web/              # Next.js frontend
  api/              # NestJS backend
packages/
  shared/           # Shared types and utilities
```

## Contributing

Please read CLAUDE.md and PLANNING.md for project guidelines and architecture details.

## License

MIT