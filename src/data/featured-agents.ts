// Pre-built agents for the marketplace - Project Management focus

export interface AgentTemplate {
  id: string
  name: string
  role: string
  description: string
  price: number
  rating: number
  downloads: number
  builder: string
  tags: string[]
  config: {
    focus: string
    mcp: string[]
    schedule?: string
    triggers?: string[]
  }
}

export interface TeamTemplate {
  id: string
  name: string
  description: string
  price: number
  rating: number
  downloads: number
  builder: string
  agents: { name: string; role: string }[]
}

export const FEATURED_AGENTS: AgentTemplate[] = [
  // Project Management Agents
  {
    id: 'pm-standup',
    name: 'StandupBot',
    role: 'Daily Reporter',
    description: 'Auto-generates daily standups from git activity across all repos. Summarizes completed work, in-progress tasks, and blockers. Saves 30+ minutes per day.',
    price: 29,
    rating: 4.9,
    downloads: 1250,
    builder: 'OliwoodLabs',
    tags: ['project-management', 'automation', 'reporting'],
    config: {
      focus: 'Cross-project daily standup generation',
      mcp: ['github', 'linear', 'slack'],
      schedule: 'daily 8:00am',
      triggers: ['manual', 'schedule']
    }
  },
  {
    id: 'pm-reviewer',
    name: 'ReviewBot',
    role: 'PR Reviewer',
    description: 'Automated code review with security patterns, brand compliance, type safety, and accessibility checks. Catches issues before they reach production.',
    price: 49,
    rating: 4.8,
    downloads: 890,
    builder: 'OliwoodLabs',
    tags: ['code-quality', 'security', 'automation'],
    config: {
      focus: 'Automated code review with security and brand compliance',
      mcp: ['github', 'playwright'],
      triggers: ['pr_opened', 'pr_updated']
    }
  },
  {
    id: 'pm-taskmaster',
    name: 'TaskMaster',
    role: 'Task Orchestrator',
    description: 'Intelligent task assignment based on agent skills, availability, and workload. Balances work across your team and identifies bottlenecks.',
    price: 39,
    rating: 4.7,
    downloads: 720,
    builder: 'OliwoodLabs',
    tags: ['project-management', 'orchestration', 'optimization'],
    config: {
      focus: 'Smart task distribution and workload balancing',
      mcp: ['linear', 'github'],
      triggers: ['task_created', 'agent_idle']
    }
  },
  {
    id: 'pm-dockeeper',
    name: 'DocBot',
    role: 'Documentation Keeper',
    description: 'Keeps CLAUDE.md, AGENTS.md, README, and API docs in sync with actual code. Detects drift and auto-generates updates on every commit.',
    price: 29,
    rating: 4.6,
    downloads: 650,
    builder: 'OliwoodLabs',
    tags: ['documentation', 'automation', 'accuracy'],
    config: {
      focus: 'Documentation accuracy and freshness',
      mcp: ['github', 'filesystem'],
      triggers: ['commit', 'pr_merged']
    }
  },
  {
    id: 'pm-security',
    name: 'SecBot',
    role: 'Security Scanner',
    description: 'Daily security scans across all repos. Finds vulnerabilities in dependencies, exposed secrets, and unsafe code patterns with remediation suggestions.',
    price: 59,
    rating: 4.9,
    downloads: 1100,
    builder: 'OliwoodLabs',
    tags: ['security', 'compliance', 'automation'],
    config: {
      focus: 'Cross-project security auditing',
      mcp: ['github', 'filesystem'],
      schedule: 'daily 2:00am'
    }
  },
  {
    id: 'pm-deployer',
    name: 'ShipBot',
    role: 'Deployment Manager',
    description: 'Handles deploy workflows for Vercel, Railway, and Fly.io. Runs pre-deploy checks, triggers deploy, monitors health, and rolls back on failure.',
    price: 49,
    rating: 4.8,
    downloads: 780,
    builder: 'OliwoodLabs',
    tags: ['devops', 'deployment', 'monitoring'],
    config: {
      focus: 'Automated deployment with health checks',
      mcp: ['github', 'playwright'],
      triggers: ['manual', 'tag_pushed']
    }
  },
  {
    id: 'pm-client-reporter',
    name: 'ReportBot',
    role: 'Client Reporter',
    description: 'Generates beautiful weekly client reports. Pulls from git activity, task completion, and time tracking. Exports to PDF or sends via email.',
    price: 39,
    rating: 4.7,
    downloads: 520,
    builder: 'GoodCompanies',
    tags: ['consulting', 'reporting', 'automation'],
    config: {
      focus: 'Automated client status reports',
      mcp: ['github', 'linear', 'resend'],
      schedule: 'weekly friday 5:00pm'
    }
  },
  {
    id: 'pm-cost-optimizer',
    name: 'CostBot',
    role: 'Cost Optimizer',
    description: 'Monitors token usage, API costs, and infrastructure spend. Identifies waste and suggests optimizations. Weekly cost breakdown by agent and project.',
    price: 29,
    rating: 4.5,
    downloads: 340,
    builder: 'OliwoodLabs',
    tags: ['cost-management', 'optimization', 'analytics'],
    config: {
      focus: 'Token and infrastructure cost optimization',
      mcp: ['filesystem'],
      schedule: 'weekly'
    }
  }
]

export const FEATURED_TEAMS: TeamTemplate[] = [
  {
    id: 'team-dev-ops',
    name: 'DevOps Department',
    description: 'Complete DevOps automation: code review, security scanning, deployment, and monitoring. Set it and forget it.',
    price: 149,
    rating: 4.9,
    downloads: 450,
    builder: 'OliwoodLabs',
    agents: [
      { name: 'ReviewBot', role: 'PR Reviewer' },
      { name: 'SecBot', role: 'Security Scanner' },
      { name: 'ShipBot', role: 'Deployment Manager' },
      { name: 'DocBot', role: 'Documentation Keeper' }
    ]
  },
  {
    id: 'team-project-mgmt',
    name: 'Project Management Suite',
    description: 'Full PM automation: standups, task orchestration, reporting, and cost tracking. Perfect for solo founders or small teams.',
    price: 99,
    rating: 4.8,
    downloads: 680,
    builder: 'OliwoodLabs',
    agents: [
      { name: 'StandupBot', role: 'Daily Reporter' },
      { name: 'TaskMaster', role: 'Task Orchestrator' },
      { name: 'ReportBot', role: 'Client Reporter' },
      { name: 'CostBot', role: 'Cost Optimizer' }
    ]
  },
  {
    id: 'team-consulting',
    name: 'Consulting Agency Bundle',
    description: 'Built for agencies managing multiple clients. Client reporting, project health tracking, and billable hour optimization.',
    price: 199,
    rating: 4.7,
    downloads: 290,
    builder: 'GoodCompanies',
    agents: [
      { name: 'ReportBot', role: 'Client Reporter' },
      { name: 'TaskMaster', role: 'Task Orchestrator' },
      { name: 'StandupBot', role: 'Daily Reporter' },
      { name: 'CostBot', role: 'Cost Optimizer' },
      { name: 'DocBot', role: 'Documentation Keeper' }
    ]
  }
]
