import { NextRequest, NextResponse } from 'next/server';
import type {
  Agent,
  CreateAgentInput,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// Mock data store - replace with actual database calls
const agents: Map<string, Agent> = new Map();

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<Agent> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const creatorId = searchParams.get('creatorId');
    const isPublic = searchParams.get('isPublic');

    let filteredAgents = Array.from(agents.values());

    // Apply filters
    if (creatorId) {
      filteredAgents = filteredAgents.filter(
        (agent) => agent.creatorId === creatorId
      );
    }

    if (isPublic !== null) {
      filteredAgents = filteredAgents.filter(
        (agent) => agent.isPublic === (isPublic === 'true')
      );
    }

    // Sort by creation date (newest first)
    filteredAgents.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const total = filteredAgents.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedAgents = filteredAgents.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedAgents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Agent>>> {
  try {
    const body: CreateAgentInput = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.model || !body.systemPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, model, systemPrompt' },
        { status: 400 }
      );
    }

    // Validate name length
    if (body.name.length < 3 || body.name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 3 and 100 characters' },
        { status: 400 }
      );
    }

    // TODO: Get actual user ID from authentication
    const creatorId = 'user_placeholder';

    const now = new Date().toISOString();
    const agent: Agent = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description,
      model: body.model,
      systemPrompt: body.systemPrompt,
      tools: body.tools || [],
      price: body.price || 0,
      creatorId,
      isPublic: body.isPublic ?? false,
      createdAt: now,
      updatedAt: now,
    };

    agents.set(agent.id, agent);

    return NextResponse.json({ data: agent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
