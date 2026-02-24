<p align="center">
  <img src="./public/logo.png" alt="CoFounder Marketplace Logo" width="120" height="120" />
</p>

<h1 align="center">CoFounder Marketplace</h1>

<p align="center">
  <strong>:robot: The App Store for AI Agents :robot:</strong>
</p>

<p align="center">
  Discover, purchase, and deploy pre-built AI agents with one click.<br/>
  Build agents, list them, and earn 70% on every sale.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#agent-catalog">Agents</a> •
  <a href="#team-bundles">Teams</a> •
  <a href="#api-documentation">API</a> •
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

## :sparkles: Features

<table>
  <tr>
    <td align="center" width="33%">
      <h3>:package: 8 Pre-Built Agents</h3>
      <p>Production-ready AI agents for standups, code review, security, deployment, and more</p>
    </td>
    <td align="center" width="33%">
      <h3>:busts_in_silhouette: 3 Team Bundles</h3>
      <p>Coordinated agent teams for DevOps, Project Management, and Consulting</p>
    </td>
    <td align="center" width="33%">
      <h3>:rocket: One-Click Deploy</h3>
      <p>Deploy agents to production in seconds with automatic configuration</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <h3>:lock: Secure Auth</h3>
      <p>Enterprise-grade authentication powered by Clerk</p>
    </td>
    <td align="center">
      <h3>:credit_card: Stripe Connect</h3>
      <p>Seamless payments with automatic builder payouts</p>
    </td>
    <td align="center">
      <h3>:zap: Real-Time Search</h3>
      <p>Instant agent discovery with Meilisearch</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <h3>:bar_chart: Usage Analytics</h3>
      <p>Track tokens, tasks, and costs per agent</p>
    </td>
    <td align="center">
      <h3>:star: Reviews & Ratings</h3>
      <p>Community-driven agent quality scores</p>
    </td>
    <td align="center">
      <h3>:money_with_wings: 70% Revenue Share</h3>
      <p>Builders keep 70% of every sale</p>
    </td>
  </tr>
</table>

---

## :camera: Screenshots

<p align="center">
  <em>Screenshots coming soon</em>
</p>

<table>
  <tr>
    <td align="center">
      <img src="./public/screenshots/marketplace.png" alt="Marketplace Home" width="400" />
      <br /><strong>Marketplace Home</strong>
    </td>
    <td align="center">
      <img src="./public/screenshots/agent-detail.png" alt="Agent Detail" width="400" />
      <br /><strong>Agent Detail</strong>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./public/screenshots/deploy.png" alt="One-Click Deploy" width="400" />
      <br /><strong>One-Click Deploy</strong>
    </td>
    <td align="center">
      <img src="./public/screenshots/dashboard.png" alt="Builder Dashboard" width="400" />
      <br /><strong>Builder Dashboard</strong>
    </td>
  </tr>
</table>

---

## :rocket: Quick Start

### Prerequisites

- **Node.js 20+** - [Download](https://nodejs.org/)
- **PostgreSQL** - Local instance or cloud (Neon, Supabase, etc.)
- **Stripe Account** - With Connect enabled for payouts
- **Clerk Account** - For authentication

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/cofounder-marketplace.git
cd cofounder-marketplace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Configuration

Create a `.env.local` file with the following:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cofounder_marketplace

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# CoFounder Platform (optional)
COFOUNDER_API_URL=http://localhost:3456

# Webhooks
USAGE_WEBHOOK_SECRET=your_webhook_secret
```

### Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed

# Open database studio
npm run db:studio
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the marketplace.

---

## :robot: Agent Catalog

| Agent | Role | Description | Price | Rating |
|-------|------|-------------|-------|--------|
| :clipboard: **StandupBot** | Daily Reporter | Auto-generates daily standups from git activity. Summarizes completed work, in-progress tasks, and blockers. | $29/mo | :star: 4.9 |
| :mag: **ReviewBot** | PR Reviewer | Automated code review with security patterns, brand compliance, type safety, and accessibility checks. | $49/mo | :star: 4.8 |
| :dart: **TaskMaster** | Task Orchestrator | Intelligent task assignment based on agent skills, availability, and workload balancing. | $39/mo | :star: 4.7 |
| :page_facing_up: **DocBot** | Documentation Keeper | Keeps CLAUDE.md, AGENTS.md, README, and API docs in sync with actual code changes. | $29/mo | :star: 4.6 |
| :shield: **SecBot** | Security Scanner | Daily security scans for vulnerabilities, exposed secrets, and unsafe code patterns. | $59/mo | :star: 4.9 |
| :ship: **ShipBot** | Deployment Manager | Handles deploy workflows for Vercel, Railway, and Fly.io with health checks and rollback. | $49/mo | :star: 4.8 |
| :memo: **ReportBot** | Client Reporter | Generates beautiful weekly client reports from git activity and task completion. | $39/mo | :star: 4.7 |
| :chart_with_downwards_trend: **CostBot** | Cost Optimizer | Monitors token usage, API costs, and infrastructure spend with optimization suggestions. | $29/mo | :star: 4.5 |

---

## :busts_in_silhouette: Team Bundles

Teams are pre-configured collections of agents that work together seamlessly.

### :wrench: DevOps Department — $149/mo

Complete DevOps automation: code review, security scanning, deployment, and documentation.

| Agent | Role |
|-------|------|
| ReviewBot | PR Reviewer |
| SecBot | Security Scanner |
| ShipBot | Deployment Manager |
| DocBot | Documentation Keeper |

### :briefcase: Project Management Suite — $99/mo

Full PM automation for solo founders and small teams.

| Agent | Role |
|-------|------|
| StandupBot | Daily Reporter |
| TaskMaster | Task Orchestrator |
| ReportBot | Client Reporter |
| CostBot | Cost Optimizer |

### :office: Consulting Agency Bundle — $199/mo

Built for agencies managing multiple clients with reporting and optimization.

| Agent | Role |
|-------|------|
| ReportBot | Client Reporter |
| TaskMaster | Task Orchestrator |
| StandupBot | Daily Reporter |
| CostBot | Cost Optimizer |
| DocBot | Documentation Keeper |

---

## :book: API Documentation

### Base URL

```
https://your-domain.com/api
```

### Authentication

All API requests require a valid Clerk session or API key.

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents (paginated) |
| `GET` | `/api/agents/:id` | Get agent by ID |
| `POST` | `/api/agents` | Create new agent (builders only) |
| `PUT` | `/api/agents/:id` | Update agent |
| `DELETE` | `/api/agents/:id` | Delete agent |

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
| `GET` | `/api/teams/:id` | Get team by ID |
| `POST` | `/api/teams` | Create new team |
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
| `POST /api/webhooks/stripe` | Stripe payment events |
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
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## :hammer_and_wrench: For Builders

### :moneybag: Revenue Share

| Revenue Type | Builder Share | Platform Share |
|--------------|---------------|----------------|
| Agent Sales | **70%** | 30% |
| Team Bundle Sales | **70%** | 30% |
| Usage-Based Revenue | **70%** | 30% |

### Getting Started as a Builder

1. **Sign up** at [cofounder.ai/builders](https://cofounder.ai/builders)
2. **Connect Stripe** to receive automatic payouts
3. **Create your agent** with our visual editor or API
4. **Submit for review** — we verify quality and security
5. **Go live** and start earning on every sale

### Agent Configuration

```typescript
interface AgentConfig {
  focus: string;           // Agent specialization
  mcp: string[];           // MCP tools: github, linear, slack, etc.
  schedule?: string;       // Cron schedule for automated runs
  triggers?: string[];     // Event triggers: pr_opened, commit, etc.
}
```

### Best Practices

- :white_check_mark: Write clear, specific descriptions
- :white_check_mark: Include usage examples in documentation
- :white_check_mark: Set competitive pricing based on value delivered
- :white_check_mark: Respond to reviews and support requests
- :white_check_mark: Keep agents updated with latest capabilities

---

## :world_map: Roadmap

### Q1 2025
- [x] Core marketplace MVP
- [x] Stripe Connect integration
- [x] 8 launch agents
- [x] 3 team bundles

### Q2 2025
- [ ] :test_tube: Agent testing sandbox
- [ ] :globe_with_meridians: Custom domains for builders
- [ ] :chart_with_upwards_trend: Advanced analytics dashboard
- [ ] :speech_balloon: In-app messaging

### Q3 2025
- [ ] :iphone: Mobile app (iOS & Android)
- [ ] :electric_plug: Third-party integrations (Zapier, Make)
- [ ] :trophy: Builder certification program
- [ ] :chains: Agent chaining API

### Q4 2025
- [ ] :building_construction: Enterprise tier with SSO
- [ ] :earth_africa: Marketplace localization (10+ languages)
- [ ] :robot: AI-powered agent recommendations
- [ ] :handshake: Partner program launch

---

## :gear: Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **Runtime** | React 19 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn/ui |
| **API Layer** | tRPC 11 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Authentication** | Clerk |
| **Payments** | Stripe Connect |
| **Search** | Meilisearch |
| **Testing** | Vitest |
| **Deployment** | Vercel |

---

## :building_construction: Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── agents/        # Agent CRUD endpoints
│   │   ├── teams/         # Team CRUD endpoints
│   │   ├── deploy/        # Deployment triggers
│   │   └── webhooks/      # Stripe & usage webhooks
│   └── page.tsx           # Marketplace homepage
├── components/            # React components
│   └── ui/               # Reusable UI components (shadcn)
├── data/                  # Static data & templates
│   └── featured-agents.ts # Pre-built agent catalog
├── db/                    # Database layer
│   ├── schema.ts         # Drizzle schema definitions
│   └── index.ts          # Database connection
├── lib/                   # Utility functions
│   └── cofounder-api.ts  # CoFounder platform client
└── types/                 # TypeScript type definitions
    └── index.ts          # Shared types
```

---

## :clipboard: Available Scripts

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

## :handshake: Contributing

We welcome contributions from the community!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make** your changes with clear commit messages
4. **Test** your changes
   ```bash
   npm run test
   npm run typecheck
   npm run lint
   ```
5. **Push** to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

### Code of Conduct

Be respectful, inclusive, and constructive. We're building something great together.

---

## :scroll: License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 CoFounder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<p align="center">
  Built with :heart: by <a href="https://cofounder.ai">CoFounder</a> — The AI-powered development platform
</p>

<p align="center">
  <a href="https://cofounder.ai">Website</a> •
  <a href="https://docs.cofounder.ai">Docs</a> •
  <a href="https://twitter.com/cofounderai">Twitter</a> •
  <a href="https://discord.gg/cofounder">Discord</a>
</p>
