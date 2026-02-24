// Agent Registry - All pre-built PM agents for CoFounder Marketplace

export interface AgentConfig {
  id: string
  name: string
  version: string
  role: string
  model: string
  schedule?: {
    cron: string
    timezone: string
  }
  triggers: string[]
  mcp_servers: string[]
  memory: {
    enabled: boolean
    retention_days: number
  }
  [key: string]: unknown
}

export interface AgentDefinition {
  config: AgentConfig
  promptPath: string
}

// Agent IDs for type safety
export const AGENT_IDS = {
  STANDUP_BOT: 'pm-standup',
  REVIEW_BOT: 'pm-reviewer',
  TASK_MASTER: 'pm-taskmaster',
  DOC_BOT: 'pm-dockeeper',
  SEC_BOT: 'pm-security',
  SHIP_BOT: 'pm-deployer',
  REPORT_BOT: 'pm-client-reporter',
  COST_BOT: 'pm-cost-optimizer',
} as const

export type AgentId = typeof AGENT_IDS[keyof typeof AGENT_IDS]

// Agent metadata for the marketplace
export const AGENT_REGISTRY: Record<AgentId, {
  configPath: string
  promptPath: string
  category: string
  requiredMcp: string[]
}> = {
  [AGENT_IDS.STANDUP_BOT]: {
    configPath: './standup-bot/config.json',
    promptPath: './standup-bot/prompt.md',
    category: 'project-management',
    requiredMcp: ['github', 'linear', 'slack'],
  },
  [AGENT_IDS.REVIEW_BOT]: {
    configPath: './review-bot/config.json',
    promptPath: './review-bot/prompt.md',
    category: 'code-quality',
    requiredMcp: ['github', 'playwright'],
  },
  [AGENT_IDS.TASK_MASTER]: {
    configPath: './task-master/config.json',
    promptPath: './task-master/prompt.md',
    category: 'project-management',
    requiredMcp: ['linear', 'github'],
  },
  [AGENT_IDS.DOC_BOT]: {
    configPath: './doc-bot/config.json',
    promptPath: './doc-bot/prompt.md',
    category: 'documentation',
    requiredMcp: ['github', 'filesystem'],
  },
  [AGENT_IDS.SEC_BOT]: {
    configPath: './sec-bot/config.json',
    promptPath: './sec-bot/prompt.md',
    category: 'security',
    requiredMcp: ['github', 'filesystem'],
  },
  [AGENT_IDS.SHIP_BOT]: {
    configPath: './ship-bot/config.json',
    promptPath: './ship-bot/prompt.md',
    category: 'devops',
    requiredMcp: ['github', 'playwright'],
  },
  [AGENT_IDS.REPORT_BOT]: {
    configPath: './report-bot/config.json',
    promptPath: './report-bot/prompt.md',
    category: 'consulting',
    requiredMcp: ['github', 'linear', 'resend'],
  },
  [AGENT_IDS.COST_BOT]: {
    configPath: './cost-bot/config.json',
    promptPath: './cost-bot/prompt.md',
    category: 'cost-management',
    requiredMcp: ['filesystem'],
  },
}

// Helper to get all agents in a category
export function getAgentsByCategory(category: string): AgentId[] {
  return Object.entries(AGENT_REGISTRY)
    .filter(([, meta]) => meta.category === category)
    .map(([id]) => id as AgentId)
}

// Helper to check if user has required MCP servers
export function checkMcpRequirements(
  agentId: AgentId,
  availableMcp: string[]
): { met: boolean; missing: string[] } {
  const required = AGENT_REGISTRY[agentId].requiredMcp
  const missing = required.filter(mcp => !availableMcp.includes(mcp))
  return { met: missing.length === 0, missing }
}
