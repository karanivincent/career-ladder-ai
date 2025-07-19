# PLANNING.md - Career Ladder AI Project

## Vision & Goals

### Product Vision
Create an engaging web application that recreates the magic of Max Klymenko's Career Ladder series, where an AI assistant attempts to guess users' professions through creative, playful questioning within a 2-minute time limit.

### Core Values
- **Entertainment First**: The game should be fun and addictive
- **Celebrate Diversity**: Showcase the wide variety of careers people pursue
- **AI Personality**: Demonstrate conversational AI at its most charming
- **Social Sharing**: Create memorable moments worth sharing

### Success Metrics
- Average session duration > 3 minutes
- Return user rate > 30% 
- Social share rate > 20%
- AI guess success rate 40-60% (challenging but fair)
- User satisfaction score > 4.5/5

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vercel)                      │
│                     Next.js 14 App Router                     │
│                          React 18                             │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        │
┌───────────────────────┴─────────────────────────────────────┐
│                    API Gateway (Railway)                      │
│                         NestJS                                │
│                    REST API + WebSockets                      │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
                │                           │
┌───────────────┴────────────┐ ┌───────────┴─────────────────┐
│        Supabase            │ │      AI Service             │
│   PostgreSQL + Realtime    │ │   OpenAI GPT-4 API         │
│     Authentication         │ │    (or Claude API)          │
└────────────────────────────┘ └─────────────────────────────┘
```

### Data Flow
1. User starts game → Frontend creates session
2. Frontend establishes Realtime connection with Supabase
3. User inputs trigger API calls to NestJS backend
4. Backend processes with AI service and updates Supabase
5. Realtime broadcasts updates to Frontend
6. Frontend renders changes instantly

### Key Design Decisions
- **Monorepo Structure**: Shared types and easier deployment
- **Realtime Updates**: Supabase Realtime for instant chat experience
- **Stateless Backend**: All state in Supabase for scalability
- **Edge Functions**: Optional for lightweight operations
- **Progressive Enhancement**: Works without JS, better with it

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Process Manager**: PM2 (production)

### Database & Infrastructure
- **Database**: Supabase (PostgreSQL 15)
- **Realtime**: Supabase Realtime Channels
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Caching**: Redis (optional for production)
- **CDN**: Cloudflare (production)

### AI Integration
- **Primary**: OpenAI GPT-4 API
- **Alternative**: Anthropic Claude API
- **Token Management**: tiktoken
- **Prompt Management**: Custom templates

### DevOps & Deployment
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway or Render
- **Monitoring**: Sentry + Vercel Analytics
- **Logging**: Winston + Supabase Logs

## Required Tools & Setup

### Development Environment

#### Required Software
```bash
# Core Requirements
- Node.js 20.x LTS (use nvm/fnm for version management)
- npm 10.x or pnpm 8.x
- Git 2.x
- VS Code (recommended) or preferred IDE

# Database Tools
- Supabase CLI
- PostgreSQL client (psql or GUI like TablePlus)
- Prisma CLI (installed via npm)

# Optional but Recommended
- Docker Desktop (for containerized development)
- Postman or Insomnia (API testing)
- ngrok (for webhook testing)
```

#### VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "mikestead.dotenv",
    "usernamehw.errorlens"
  ]
}
```

#### Environment Setup
```bash
# 1. Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 2. Install Supabase CLI
brew install supabase/tap/supabase  # macOS
# or
npm install -g supabase              # All platforms

# 3. Install global tools
npm install -g @nestjs/cli prisma

# 4. Clone and setup project
git clone <repository-url>
cd career-ladder-ai
npm install

# 5. Setup Supabase locally
supabase init
supabase start

# 6. Configure environment variables
cp .env.example .env.local  # Frontend
cp .env.example .env        # Backend
# Edit both files with your keys

# 7. Run database migrations
cd apps/api
npx prisma migrate dev

# 8. Start development servers
npm run dev
```

### API Keys & Services

#### Required Accounts
1. **Supabase Account**
   - Create project at https://supabase.com
   - Get API URL and keys from project settings

2. **OpenAI Account**
   - Sign up at https://platform.openai.com
   - Generate API key with GPT-4 access
   - Set up billing and usage limits

3. **GitHub Account**
   - For version control and CI/CD
   - Set up repository and actions

4. **Vercel Account**
   - For frontend deployment
   - Connect GitHub repository

5. **Railway/Render Account**
   - For backend deployment
   - Configure environment variables

#### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=postgresql://postgres:[password]@localhost:54322/postgres
DIRECT_URL=postgresql://postgres:[password]@localhost:54322/postgres

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4-turbo-preview

# App Config
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
```

## Development Workflow

### Git Workflow
```bash
# Branch naming
feature/add-timer-component
fix/ai-response-timeout
chore/update-dependencies

# Commit message format
feat: add countdown timer component
fix: resolve AI response timeout issue
docs: update setup instructions
test: add game flow e2e tests
```

### Code Quality Standards
- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier with 2-space indent
- **Type Safety**: TypeScript strict mode
- **Testing**: Minimum 80% coverage
- **Documentation**: JSDoc for complex functions

### Pre-commit Hooks
```json
// .husky/pre-commit
{
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}

// lint-staged.config.js
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

## Project Phases

### Phase 1: MVP (Weeks 1-6)
- [ ] Basic game flow with timer
- [ ] AI integration with simple prompts
- [ ] Chat interface (no real-time)
- [ ] Results screen
- [ ] Desktop web only

### Phase 2: Enhancement (Weeks 7-10)
- [ ] Supabase Realtime integration
- [ ] Mobile responsive design
- [ ] User accounts (optional)
- [ ] Game history
- [ ] Social sharing

### Phase 3: Polish (Weeks 11-12)
- [ ] Advanced AI personality
- [ ] Animations and transitions
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Production deployment

### Phase 4: Growth (Post-launch)
- [ ] Multiplayer mode
- [ ] Leaderboards
- [ ] Achievement system
- [ ] Career insights dashboard
- [ ] API for third-party integration

## Performance Targets

### Frontend
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90
- Bundle size < 200KB (gzipped)

### Backend
- API response time < 200ms (p95)
- AI response time < 2s
- WebSocket latency < 50ms
- Support 1000+ concurrent games

### Database
- Query time < 50ms (p95)
- Connection pool size: 20
- Automatic backups every 6 hours
- Point-in-time recovery enabled

## Security Considerations

### Frontend Security
- Content Security Policy headers
- XSS protection via React
- Environment variable validation
- Secure cookie settings

### Backend Security
- Rate limiting (100 req/min per IP)
- Input validation and sanitization
- SQL injection prevention (Prisma)
- API key rotation policy

### AI Security
- Prompt injection prevention
- Content filtering
- Token usage limits
- Response sanitization

### Data Privacy
- GDPR compliance
- Minimal data collection
- Anonymous game mode option
- Data retention policy (90 days)

## Monitoring & Observability

### Application Monitoring
- Sentry for error tracking
- Custom game metrics dashboard
- AI performance tracking
- User behavior analytics

### Infrastructure Monitoring
- Uptime monitoring (99.9% target)
- Database performance metrics
- API endpoint monitoring
- Cost tracking and alerts

### Business Metrics Dashboard
- Daily active users
- Game completion rate
- AI success rate by profession
- User retention cohorts
- Social share tracking

## Risk Mitigation

### Technical Risks
- **AI API Downtime**: Implement fallback AI service
- **Database Scaling**: Plan for read replicas
- **WebSocket Limits**: Design for graceful degradation
- **Cost Overruns**: Implement usage caps and alerts

### Business Risks
- **Low Retention**: A/B test game mechanics
- **AI Too Easy/Hard**: Dynamic difficulty adjustment
- **Content Moderation**: Profession whitelist
- **Competitive Landscape**: Unique features roadmap

## Success Criteria

### Technical Success
- Zero critical bugs in production
- <1% error rate
- 99.9% uptime
- Sub-2s page loads

### Product Success
- 10,000 games played in first month
- 4.5+ star rating
- 30% weekly retention
- Viral coefficient > 1.2

### Business Success
- Break-even within 6 months
- 100k MAU within first year
- Partnership opportunities
- API monetization potential

---

This planning document is a living document and should be updated as the project evolves.