# Career Ladder AI Web App

Always read PLANNING.md at the start of every new conversation, check TASKS.md before starting your work, mark completed tasks to TASKS.md immediately, and add newly discovered tasks to TASKS.md when found.

An interactive game where an AI assistant attempts to guess users' professions through creative questioning within a 2-minute time limit.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: NestJS + Prisma
- **Database**: Supabase (PostgreSQL + Realtime + Auth)
- **AI**: OpenAI GPT-4 or Claude API

## Quick Commands
```bash
# Development
npm run dev:web      # Start Next.js (port 3000)
npm run dev:api      # Start NestJS (port 3001)
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio

# Testing
npm run test:web     # Test frontend
npm run test:api     # Test backend
npm run test:e2e     # Run E2E tests

# Supabase
npx supabase start   # Start local Supabase
npx supabase gen types typescript > apps/web/types/supabase.ts
```

## Project Structure
```
apps/
  web/              # Next.js frontend
    app/            # App router pages
    components/     # React components
    hooks/          # Custom hooks
    lib/supabase/   # Supabase clients
  api/              # NestJS backend
    src/modules/    # Feature modules
    prisma/         # Database schema
```

## Key Files
- `apps/web/app/game/[id]/page.tsx` - Main game interface
- `apps/api/src/modules/ai/ai.service.ts` - AI question generation
- `apps/api/prisma/schema.prisma` - Database models
- `.env.local` (web) and `.env` (api) - Environment variables

## Core Features
1. **2-minute timed game** with visual countdown
2. **Creative AI questioning** using metaphors and associations
3. **Real-time chat interface** via Supabase Realtime
4. **Game history and statistics** tracking

## AI Personality Guidelines
The AI should be:
- Enthusiastic and energetic ("Oh!", "Interesting!")
- Creative with questions ("If your job was a vegetable...")
- Self-deprecating when wrong
- Celebratory when getting closer

## Question Strategy
1. **Opening (0-30s)**: Basic info (salary, experience, passion)
2. **Metaphorical (30-60s)**: Creative comparisons
3. **Narrowing (60-90s)**: Category elimination
4. **Rapid-fire (90-120s)**: Yes/no questions

## Development Workflow
1. Always run migrations after schema changes
2. Use Supabase local for development
3. Test with various professions (aim for 40-60% success rate)
4. Keep AI responses under 150 tokens

## Code Style
- Use TypeScript strict mode
- Functional React components with hooks
- Async/await over promises
- Descriptive variable names
- Comment complex logic

## Common Tasks

### Add a new question type
1. Update `questionStrategies` in `ai.service.ts`
2. Add to AI personality prompt
3. Test with various professions

### Update game UI
1. Components are in `apps/web/components/game/`
2. Use Tailwind classes only (no custom CSS)
3. Test mobile responsiveness

### Debug AI responses
1. Check logs in `ai.service.ts`
2. Verify OpenAI API key
3. Monitor token usage
4. Test prompts in playground first

## Testing Approach
- Unit test game logic
- Integration test AI service
- E2E test full game flow
- Always test timer edge cases

## Security Notes
- Enable RLS on all Supabase tables
- Validate user inputs
- Sanitize AI responses
- Use environment variables for secrets

## Performance Tips
- Lazy load game components
- Cache AI responses for common patterns
- Use Supabase connection pooling
- Optimize Prisma queries with select

## Deployment
- Frontend: Vercel (auto-deploy from main)
- Backend: Railway/Render
- Database: Supabase cloud

## Important URLs
- Local web: http://localhost:3000
- Local API: http://localhost:3001
- Supabase Studio: http://localhost:54323

## Session Summary - Initial Setup (Jan 19, 2025)

### What We Accomplished

1. **Initialized Monorepo Structure**
   - Created npm workspaces with `apps/` and `packages/` directories
   - Set up shared dependencies and scripts
   - Configured `.gitignore` and basic documentation

2. **Frontend Setup (Next.js)**
   - Initialized Next.js 14 with App Router and TypeScript
   - Configured Tailwind CSS with custom theme
   - Created basic homepage with "Start Game" button
   - Installed required dependencies including `tailwindcss-animate`
   - Set up environment variables with Supabase credentials

3. **Backend Setup (NestJS)**
   - Created NestJS application with modular architecture
   - Set up Prisma ORM with PostgreSQL (Supabase)
   - Created initial modules: Game, AI, and Chat
   - Configured Swagger API documentation
   - Set up environment variables with database connections

4. **Shared Types Package**
   - Created shared TypeScript types for Game, Message, and API interfaces
   - Configured build process for type sharing between frontend and backend
   - Established common data structures for the monorepo

5. **Database Setup**
   - Successfully connected to Supabase cloud instance
   - Ran initial Prisma migration creating:
     - `Game` table (id, profession, aiGuess, isSuccess, timestamps, etc.)
     - `Message` table (id, gameId, role, content, timestamp)
     - Proper indexes and relationships
   - All credentials configured and tested

6. **Development Environment**
   - Both apps successfully running:
     - Frontend: http://localhost:3000
     - Backend: http://localhost:3001 (with /health and /api docs)
   - Hot reload working for both applications
   - ESLint and Prettier configured
   - Build scripts and npm commands set up

### Current State
- ✅ Project fully initialized and running
- ✅ Database connected and migrated
- ✅ Basic UI showing homepage
- ✅ API server running with health check
- 🔄 Ready to start building game features

### Next Steps
- Build countdown timer component
- Create game flow and routing
- Implement chat interface
- Integrate AI service with OpenAI
- Set up Supabase Realtime for live updates