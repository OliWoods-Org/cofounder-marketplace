const COFOUNDER_API_URL = process.env.COFOUNDER_API_URL;

if (!COFOUNDER_API_URL) {
  console.warn('COFOUNDER_API_URL environment variable is not set');
}

interface CoFounderApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export class CoFounderApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CoFounderApiError';
  }
}

export async function cofounderApi<T>(
  endpoint: string,
  options: CoFounderApiOptions = {}
): Promise<T> {
  if (!COFOUNDER_API_URL) {
    throw new CoFounderApiError(
      'COFOUNDER_API_URL is not configured',
      500
    );
  }

  const { method = 'GET', body, headers = {} } = options;

  const url = `${COFOUNDER_API_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CoFounderApiError(
      errorData.message || `CoFounder API error: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

export async function deployToCoFounder(payload: {
  teamId: string;
  environment?: 'production' | 'staging';
  config?: Record<string, unknown>;
}) {
  return cofounderApi<{
    deploymentId: string;
    status: string;
    url?: string;
    createdAt: string;
  }>('/marketplace/deploy', {
    method: 'POST',
    body: payload,
  });
}
