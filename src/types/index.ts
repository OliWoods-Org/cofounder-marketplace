// Agent types
export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  tools: string[];
  price: number;
  creatorId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentInput {
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  tools?: string[];
  price?: number;
  isPublic?: boolean;
}

export interface UpdateAgentInput {
  name?: string;
  description?: string;
  model?: string;
  systemPrompt?: string;
  tools?: string[];
  price?: number;
  isPublic?: boolean;
}

// Team types
export interface Team {
  id: string;
  name: string;
  description: string;
  agents: TeamAgent[];
  workflow: TeamWorkflow;
  price: number;
  creatorId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamAgent {
  agentId: string;
  role: string;
  order: number;
}

export interface TeamWorkflow {
  type: 'sequential' | 'parallel' | 'conditional';
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  agentId: string;
  condition?: string;
  nextSteps?: string[];
}

export interface CreateTeamInput {
  name: string;
  description: string;
  agents: TeamAgent[];
  workflow: TeamWorkflow;
  price?: number;
  isPublic?: boolean;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
  agents?: TeamAgent[];
  workflow?: TeamWorkflow;
  price?: number;
  isPublic?: boolean;
}

// Deploy types
export interface DeployRequest {
  teamId: string;
  environment?: 'production' | 'staging';
  config?: DeployConfig;
}

export interface DeployConfig {
  maxConcurrency?: number;
  timeout?: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
}

export interface DeployResponse {
  deploymentId: string;
  status: 'pending' | 'deploying' | 'deployed' | 'failed';
  url?: string;
  createdAt: string;
}

// Webhook types
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export interface UsageWebhookPayload {
  deploymentId: string;
  userId: string;
  teamId: string;
  usage: {
    tokens: number;
    requests: number;
    computeTimeMs: number;
  };
  timestamp: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
