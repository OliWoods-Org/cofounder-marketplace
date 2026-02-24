import { NextRequest, NextResponse } from 'next/server';
import type { Agent, UpdateAgentInput, ApiResponse } from '@/types';

// Mock data store - replace with actual database calls
// In production, this would be imported from a shared store or database
const agents: Map<string, Agent> = new Map();

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Agent>>> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const agent = agents.get(id);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: agent });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Agent>>> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const existingAgent = agents.get(id);

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // TODO: Verify user owns this agent
    // const userId = getCurrentUserId();
    // if (existingAgent.creatorId !== userId) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body: UpdateAgentInput = await request.json();

    // Validate name length if provided
    if (body.name !== undefined) {
      if (body.name.length < 3 || body.name.length > 100) {
        return NextResponse.json(
          { error: 'Name must be between 3 and 100 characters' },
          { status: 400 }
        );
      }
    }

    // Validate price if provided
    if (body.price !== undefined && body.price < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    const updatedAgent: Agent = {
      ...existingAgent,
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.model !== undefined && { model: body.model }),
      ...(body.systemPrompt !== undefined && { systemPrompt: body.systemPrompt }),
      ...(body.tools !== undefined && { tools: body.tools }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
      updatedAt: new Date().toISOString(),
    };

    agents.set(id, updatedAgent);

    return NextResponse.json({ data: updatedAgent });
  } catch (error) {
    console.error('Error updating agent:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<{ deleted: boolean }>>> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const existingAgent = agents.get(id);

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // TODO: Verify user owns this agent
    // const userId = getCurrentUserId();
    // if (existingAgent.creatorId !== userId) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // TODO: Check if agent is part of any teams before deleting

    agents.delete(id);

    return NextResponse.json(
      { data: { deleted: true }, message: 'Agent deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}
