# CoFounder Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Connect-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)

**The App Store for AI Agents** - A two-sided marketplace where builders list AI agents and agent teams, and buyers deploy them with one click.

## Overview

CoFounder Marketplace enables:

- **Builders** to monetize their AI agents with Stripe Connect payouts
- **Buyers** to discover, purchase, and deploy pre-built agents instantly
- **Teams** to coordinate multiple agents as departments (DevOps, PM, Consulting)

Part of the [CoFounder](https://github.com/your-org/cofounder) AI agent platform.

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Stripe account with Connect enabled
- Clerk application

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/cofounder-marketplace.git
cd cofounder-marketplace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:push

# Seed initial data (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the marketplace.

---

## Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_live_... or sk_test_...) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (whsec_...) | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (pk_...) | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key (sk_...) | Yes |
| `COFOUNDER_API_URL` | CoFounder platform API URL | No |
| `USAGE_WEBHOOK_SECRET` | Secret for usage tracking webhooks | No |

### Example Configuration

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cofounder_marketplace

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# CoFounder Platform
COFOUNDER_API_URL=http://localhost:3456

# Webhooks
USAGE_WEBHOOK_SECRET=your_webhook_secret
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn/ui |
| **API Layer** | tRPC 11 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Authentication** | Clerk |
| **Payments** | Stripe Connect |
| **Search** | Meilisearch |
| **Runtime** | React 19 |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── agents/        # Agent CRUD endpoints
│   │   ├── teams/         # Team CRUD endpoints
│   │   ├── deploy/        # Deployment triggers
│   │   └── webhooks/      # Stripe & usage webhooks
│   └── page.tsx           # Marketplace homepage
├── agents/                # Agent registry & configurations
├── components/            # React components
│   └── ui/               # Reusable UI components
├── data/                  # Static data & templates
├── db/                    # Database schema & migrations
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests with Vitest |
| `npm run deploy` | Deploy to Vercel production |
| `npm run deploy:preview` | Deploy preview to Vercel |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with sample data |

---

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Link project**
   ```bash
   vercel link
   ```

3. **Set environment variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add CLERK_SECRET_KEY
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Environment Variable Setup in Vercel Dashboard

1. Go to your project settings in Vercel
2. Navigate to Environment Variables
3. Add each variable for Production, Preview, and Development environments
4. Redeploy to apply changes

### Cron Jobs

The following cron jobs are configured in `vercel.json`:

| Endpoint | Schedule | Description |
|----------|----------|-------------|
| `/api/cron/sync-agents` | Every 6 hours | Sync agent data with CoFounder platform |
| `/api/cron/usage-aggregation` | Daily at midnight | Aggregate usage metrics |
| `/api/cron/payout-processing` | Weekly on Sunday | Process builder payouts |

---

## API Endpoints

### Agents

- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/agents` - Create new agent (builder only)
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Teams

- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Webhooks

- `POST /api/webhooks/stripe` - Stripe payment webhooks
- `POST /api/webhooks/usage` - Usage tracking from CoFounder platform

---

## Featured Agents

| Agent | Role | Price |
|-------|------|-------|
| StandupBot | Daily Reporter | $29/mo |
| ReviewBot | PR Reviewer | $49/mo |
| TaskMaster | Task Orchestrator | $39/mo |
| DocBot | Documentation Keeper | $29/mo |
| SecBot | Security Scanner | $59/mo |
| ShipBot | Deployment Manager | $49/mo |
| ReportBot | Client Reporter | $39/mo |
| CostBot | Cost Optimizer | $29/mo |

---

## Revenue Model

1. **Marketplace Take Rate** - 20% on all sales (builders keep 80%)
2. **Compute Margin** - 30-40% margin on infrastructure costs
3. **CoFounder Pro Agents** - $99-499/mo (100% margin)
4. **Platform Subscriptions** - Free / Pro / Team / Enterprise tiers

---

## Related Projects

- [CoFounder](https://github.com/your-org/cofounder) - AI agent orchestration platform
- [CoFounder Docs](https://docs.cofounder.ai) - Platform documentation

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with [CoFounder](https://cofounder.ai) - The AI-powered development platform
