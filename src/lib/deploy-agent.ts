// Deploy agent to CoFounder orchestrator

import { AGENT_REGISTRY, type AgentId } from '@/agents'

const COFOUNDER_API = process.env.COFOUNDER_API_URL || 'http://localhost:3456'

export interface DeployResult {
  success: boolean
  agentId: string
  instanceId?: string
  error?: string
}

export interface AgentDeployRequest {
  agentId: AgentId
  userId: string
  purchaseId: string
  config?: Record<string, unknown>
}

/**
 * Deploy a marketplace agent to CoFounder
 */
export async function deployAgentToCoFounder(
  request: AgentDeployRequest
): Promise<DeployResult> {
  const { agentId, userId, purchaseId, config } = request

  // Get agent metadata
  const agentMeta = AGENT_REGISTRY[agentId]
  if (!agentMeta) {
    return { success: false, agentId, error: 'Agent not found in registry' }
  }

  try {
    // Load agent config and prompt
    const [configRes, promptRes] = await Promise.all([
      import(`@/agents/${agentId.replace('pm-', '')}/config.json`),
      fetch(`/agents/${agentId.replace('pm-', '')}/prompt.md`).then(r => r.text()),
    ])

    const agentConfig = {
      ...configRes.default,
      ...config,
      purchaseId,
      userId,
    }

    // Deploy to CoFounder orchestrator
    const response = await fetch(`${COFOUNDER_API}/api/marketplace/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
        config: agentConfig,
        prompt: promptRes,
        purchaseId,
        userId,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, agentId, error }
    }

    const result = await response.json()
    return {
      success: true,
      agentId,
      instanceId: result.instanceId,
    }
  } catch (error) {
    return {
      success: false,
      agentId,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Deploy a team of agents
 */
export async function deployTeamToCoFounder(
  agentIds: AgentId[],
  userId: string,
  purchaseId: string
): Promise<DeployResult[]> {
  const results = await Promise.all(
    agentIds.map(agentId =>
      deployAgentToCoFounder({ agentId, userId, purchaseId })
    )
  )
  return results
}

/**
 * Check agent health/status
 */
export async function checkAgentStatus(instanceId: string): Promise<{
  status: 'running' | 'stopped' | 'error' | 'unknown'
  lastRun?: string
  nextRun?: string
}> {
  try {
    const response = await fetch(
      `${COFOUNDER_API}/api/marketplace/agents/${instanceId}/status`
    )
    if (!response.ok) {
      return { status: 'unknown' }
    }
    return response.json()
  } catch {
    return { status: 'unknown' }
  }
}

/**
 * Stop a running agent
 */
export async function stopAgent(instanceId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${COFOUNDER_API}/api/marketplace/agents/${instanceId}/stop`,
      { method: 'POST' }
    )
    return response.ok
  } catch {
    return false
  }
}
