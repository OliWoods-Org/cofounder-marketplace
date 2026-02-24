<p align="center">
  <img src="./public/logo.png" alt="CoFounder Marketplace Logo" width="120" height="120" />
</p>

<h1 align="center">CoFounder Marketplace</h1>

<p align="center">
  <strong>The App Store for AI Agents</strong>
</p>

<p align="center">
  Discover, purchase, and deploy pre-built AI agents with one click.<br/>
  Build agents, list them, and earn 70% on every sale.
</p>

<p align="center">
  <a href="#features">Features</a> |
  <a href="#quick-start">Quick Start</a> |
  <a href="#agent-catalog">Agents</a> |
  <a href="#team-bundles">Teams</a> |
  <a href="#api-documentation">API</a> |
  <a href="#for-builders">For Builders</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk Auth" />
  <img src="https://img.shields.io/badge/Stripe-Connect-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe Connect" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tRPC-11-2596BE?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC" />
  <img src="https://img.shields.io/badge/Meilisearch-Search-FF5CAA?style=for-the-badge&logo=meilisearch&logoColor=white" alt="Meilisearch" />
  <img src="https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## Overview

CoFounder Marketplace is a platform for buying, selling, and deploying production-ready AI agents. Agents are pre-configured Claude-based workers that plug directly into the CoFounder orchestration platform. Buyers get one-click deployment. Builders get 70% revenue share on every sale with automatic payouts via Stripe Connect.

The marketplace connects to the CoFounder orchestrator backend, which manages agent lifecycle, task assignment, and real-time monitoring. When a user deploys an agent from the marketplace, the system provisions it into their CoFounder workspace with the correct configuration, MCP tool access, and scheduling rules.

---

## Features

| Feature | Description |
|---------|-------------|
| **8 Pre-Built Agents** | Production-ready agents for standups, code review, security, deployment, documentation, task orchestration, client reporting, and cost optimization. |
| **3 Team Bundles** | Coordinated agent teams for DevOps, Project Management, and Consulting. Agents within a bundle share context and hand off tasks automatically. |
| **One-Click Deploy** | Deploy agents to a running CoFounder instance in seconds. The deployment pipeline handles configuration, tool provisioning, and schedule registration. |
| **Clerk Authentication** | Enterprise-grade authentication with SSO support, session management, and role-based access for builders vs. buyers. |
| **Stripe Connect Payments** | Marketplace transactions with automatic 70/30 revenue split. Builders connect their Stripe accounts for direct payouts. |
| **Meilisearch Integration** | Sub-millisecond agent discovery with typo tolerance, faceted filtering by category/price/rating, and instant results as you type. |
| **Usage Analytics** | Track token consumption, task completion rates, and compute time per deployed agent. Usage data feeds into billing for metered pricing models. |
| **Reviews and Ratings** | Community-driven quality scores. Buyers rate agents after deployment, and aggregate scores surface the best-performing agents. |

---

## Quick Start

### Prerequisites

- **Node.js 20+** — [Download](https://nodejs.org/)
- **PostgreSQL** — Local instance or cloud provider (Neon, Supabase, etc.)
- **Stripe Account** — With Connect enabled for marketplace payouts
- **Clerk Account** — For authentication

### Installation

```bash
git clone https://github.com/OliWoods-Org/cofounder-marketplace.git
cd cofounder-marketplace
npm install
cp .env.example .env.local
```

### Environment Configuration

Create a `.env.local` file:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cofounder_marketplace

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# CoFounder Platform (optional - for agent deployment)
COFOUNDER_API_URL=http://localhost:3456

# Webhooks
USAGE_WEBHOOK_SECRET=your_webhook_secret
```

### Database Setup

```bash
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample agents and teams (optional)
npm run db:studio     # Open Drizzle Studio for visual database browsing
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the marketplace.

---

## Agent Catalog

| Agent | Role | Description | Price |
|-------|------|-------------|-------|
| **StandupBot** | Daily Reporter | Generates daily standups from git activity. Summarizes completed work, in-progress tasks, and blockers. Pushes reports to Slack or email. | $29/mo |
| **ReviewBot** | PR Reviewer | Automated code review covering security patterns, brand compliance, type safety, accessibility, and performance. Posts inline comments on GitHub PRs. | $49/mo |
| **TaskMaster** | Task Orchestrator | Intelligent task assignment based on agent skills, availability, and workload balancing. Decomposes complex tasks into sub-tasks and routes them. | $39/mo |
| **DocBot** | Documentation Keeper | Keeps CLAUDE.md, AGENTS.md, README, and API docs in sync with code changes. Detects drift between docs and implementation. | $29/mo |
| **SecBot** | Security Scanner | Daily vulnerability scans, exposed secret detection, dependency audits, and unsafe code pattern identification. Generates remediation PRs. | $59/mo |
| **ShipBot** | Deployment Manager | Handles deploy workflows for Vercel, Railway, and Fly.io. Runs health checks post-deploy and triggers automatic rollback on failure. | $49/mo |
| **ReportBot** | Client Reporter | Generates formatted weekly client reports from git activity, task completion, and time tracking data. Outputs HTML, PDF, or Markdown. | $39/mo |
| **CostBot** | Cost Optimizer | Monitors token usage, API costs, and infrastructure spend across all agents. Suggests model downgrades and caching strategies to reduce costs. | $29/mo |

---

## Team Bundles

Teams are pre-configured collections of agents that share context and coordinate handoffs.

### DevOps Department -- $149/mo

Complete DevOps automation from code review through deployment and documentation.

| Agent | Role |
|-------|------|
| ReviewBot | PR Reviewer |
| SecBot | Security Scanner |
| ShipBot | Deployment Manager |
| DocBot | Documentation Keeper |

**Workflow:** ReviewBot reviews PRs and flags security concerns to SecBot. Once both approve, ShipBot handles deployment. DocBot updates documentation after each deploy.

### Project Management Suite -- $99/mo

Full PM automation for solo founders and small teams.

| Agent | Role |
|-------|------|
| StandupBot | Daily Reporter |
| TaskMaster | Task Orchestrator |
| ReportBot | Client Reporter |
| CostBot | Cost Optimizer |

**Workflow:** StandupBot captures daily progress. TaskMaster distributes work. ReportBot compiles weekly summaries. CostBot monitors spend and suggests optimizations.

### Consulting Agency Bundle -- $199/mo

Built for agencies managing multiple client projects simultaneously.

| Agent | Role |
|-------|------|
| ReportBot | Client Reporter |
| TaskMaster | Task Orchestrator |
| StandupBot | Daily Reporter |
| CostBot | Cost Optimizer |
| DocBot | Documentation Keeper |

**Workflow:** Multi-project tracking with per-client reporting, cross-project task distribution, cost allocation per client, and automated documentation updates.

---

## Architecture

### Deployment Pipeline

When a user clicks "Deploy" on an agent:

1. **Purchase** -- Stripe processes the payment and creates a subscription via Connect.
2. **Provisioning** -- The marketplace API calls the CoFounder orchestrator at `COFOUNDER_API_URL` with the agent configuration.
3. **Configuration** -- The orchestrator registers the agent with its MCP tools, schedule, and team assignment.
4. **Activation** -- The agent enters the idle pool and begins accepting tasks according to its configuration.
5. **Monitoring** -- Usage telemetry (tokens, tasks, compute time) streams back to the marketplace via the usage webhook for billing and analytics.

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes, middleware |
| **Language** | TypeScript 5.7 | Type safety across frontend and backend |
| **UI** | React 19 + Tailwind CSS 3.4 + shadcn/ui | Component library with dark theme |
| **API** | tRPC 11 | End-to-end type-safe API layer between client and server |
| **Database** | PostgreSQL + Drizzle ORM | Schema management, migrations, type-safe queries |
| **Auth** | Clerk | Session management, SSO, role-based access |
| **Payments** | Stripe Connect | Marketplace transactions, builder payouts, subscriptions |
| **Search** | Meilisearch | Full-text search with typo tolerance and faceted filtering |
| **Testing** | Vitest | Unit and integration tests |
| **Deployment** | Vercel | Production hosting with edge functions |

---

## API Documentation

### Base URL

```
https://your-domain.com/api
```

### Authentication

All API requests require a valid Clerk session or API key.

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents (paginated, filterable) |
| `GET` | `/api/agents/:id` | Get agent details including reviews and usage stats |
| `POST` | `/api/agents` | Create new agent (builders only) |
| `PUT` | `/api/agents/:id` | Update agent configuration or listing |
| `DELETE` | `/api/agents/:id` | Remove agent from marketplace |

#### List Agents

```bash
curl -X GET "https://your-domain.com/api/agents?page=1&limit=10&isPublic=true"
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "StandupBot",
      "description": "Auto-generates daily standups...",
      "model": "claude-3-sonnet",
      "price": 29,
      "isPublic": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teams` | List all teams (paginated) |
| `GET` | `/api/teams/:id` | Get team with member agents and workflow |
| `POST` | `/api/teams` | Create new team with agent composition |
| `PUT` | `/api/teams/:id` | Update team |
| `DELETE` | `/api/teams/:id` | Delete team |

#### Create Team

```bash
curl -X POST "https://your-domain.com/api/teams" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My DevOps Team",
    "description": "Custom DevOps automation",
    "agents": [
      { "agentId": "uuid-1", "role": "PR Reviewer", "order": 1 },
      { "agentId": "uuid-2", "role": "Security Scanner", "order": 2 }
    ],
    "workflow": {
      "type": "sequential",
      "steps": [
        { "agentId": "uuid-1" },
        { "agentId": "uuid-2" }
      ]
    },
    "price": 99,
    "isPublic": true
  }'
```

### Webhooks

| Endpoint | Description |
|----------|-------------|
| `POST /api/webhooks/stripe` | Stripe payment events (checkout, subscription, invoice) |
| `POST /api/webhooks/usage` | Usage tracking from CoFounder platform |

#### Usage Webhook Payload

```json
{
  "deploymentId": "deploy_xxx",
  "userId": "user_xxx",
  "teamId": "team_xxx",
  "usage": {
    "tokens": 15000,
    "requests": 42,
    "computeTimeMs": 8500
  },
  "timestamp": "2026-02-15T10:30:00Z"
}
```

---

## For Builders

### Revenue Share

| Revenue Type | Builder Share | Platform Share |
|--------------|---------------|----------------|
| Agent Sales | **70%** | 30% |
| Team Bundle Sales | **70%** | 30% |
| Usage-Based Revenue | **70%** | 30% |

Payouts are processed automatically via Stripe Connect. Builders receive funds directly in their connected Stripe account.

### Getting Started as a Builder

1. **Sign up** at [cofounder.ai/builders](https://cofounder.ai/builders)
2. **Connect Stripe** to receive automatic payouts
3. **Create your agent** with the visual editor or API
4. **Submit for review** -- the team verifies quality and security
5. **Go live** and start earning on every sale

### Agent Configuration

```typescript
interface AgentConfig {
  focus: string;           // Agent specialization description
  mcp: string[];           // MCP tools: github, linear, slack, filesystem, etc.
  schedule?: string;       // Cron schedule for automated runs
  triggers?: string[];     // Event triggers: pr_opened, commit, deploy, etc.
}
```

### Best Practices

- Write clear, specific descriptions that explain what the agent does and when to use it
- Include usage examples and sample outputs in documentation
- Set competitive pricing based on the value delivered, not the complexity of the implementation
- Respond to reviews and support requests within 24 hours
- Keep agents updated when underlying APIs or capabilities change

---

## Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── api/                   # API routes (tRPC + REST)
│   │   ├── agents/            # Agent CRUD endpoints
│   │   ├── teams/             # Team CRUD endpoints
│   │   ├── deploy/            # Deployment triggers
│   │   └── webhooks/          # Stripe and usage webhooks
│   ├── agents/                # Agent browsing pages
│   ├── builder/               # Builder dashboard pages
│   ├── dashboard/             # Buyer dashboard pages
│   ├── marketplace/           # Marketplace browsing and search
│   ├── workspace/             # Workspace management
│   ├── sign-in/               # Clerk sign-in flow
│   ├── sign-up/               # Clerk sign-up flow
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Marketplace homepage
│
├── components/                # React components
│   ├── auth/                  # Authentication UI (sign-in, guards)
│   ├── builder/               # Builder-specific components (listings, analytics)
│   ├── dashboard/             # Buyer dashboard components (deployments, usage)
│   ├── marketplace/           # Marketplace components (cards, search, filters)
│   └── ui/                    # Reusable primitives (shadcn/ui)
│
├── data/
│   └── featured-agents.ts     # Pre-built agent catalog definitions
│
├── db/
│   ├── schema.ts              # Drizzle schema (agents, teams, deployments, usage)
│   ├── schema/                # Schema modules
│   ├── migrations/            # Database migrations
│   └── index.ts               # Database connection pool
│
├── lib/
│   ├── cofounder-api.ts       # CoFounder orchestrator API client
│   ├── deploy-agent.ts        # Agent deployment logic
│   ├── search/                # Meilisearch client and indexing
│   ├── stripe/                # Stripe Connect helpers
│   ├── stripe.ts              # Stripe core client
│   └── trpc/                  # tRPC router and context
│
└── types/
    └── index.ts               # Shared TypeScript type definitions
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

## Roadmap

### Q1 2026
- [x] Core marketplace MVP
- [x] Stripe Connect integration
- [x] 8 launch agents
- [x] 3 team bundles

### Q2 2026
- [ ] Agent testing sandbox
- [ ] Custom domains for builders
- [ ] Advanced analytics dashboard
- [ ] In-app messaging between builders and buyers

### Q3 2026
- [ ] Mobile app (iOS and Android)
- [ ] Third-party integrations (Zapier, Make)
- [ ] Builder certification program
- [ ] Agent chaining API for multi-step workflows

### Q4 2026
- [ ] Enterprise tier with SSO and audit logs
- [ ] Marketplace localization (10+ languages)
- [ ] AI-powered agent recommendations based on workspace analysis
- [ ] Partner program launch

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make** your changes with clear commit messages
4. **Test** your changes:
   ```bash
   npm run test
   npm run typecheck
   npm run lint
   ```
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and naming conventions
- Write tests for new features and bug fixes
- Update documentation when changing public APIs or behavior
- Keep commits atomic and well-described

---

## License

MIT License -- see [LICENSE](LICENSE) for details.

Copyright (c) 2026 CoFounder

---

<p align="center">
  Built by the CoFounder team at <a href="https://github.com/OliWoods-Org">OliWoods</a>
</p>
