import { NextRequest, NextResponse } from 'next/server';
import type { Team, UpdateTeamInput, ApiResponse } from '@/types';

// Mock data store - replace with actual database calls
// In production, this would be imported from a shared store or database
const teams: Map<string, Team> = new Map();

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Team>>> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const team = teams.get(id);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Team>>> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const existingTeam = teams.get(id);

    if (!existingTeam) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // TODO: Verify user owns this team
    // const userId = getCurrentUserId();
    // if (existingTeam.creatorId !== userId) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body: UpdateTeamInput = await request.json();

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

    // Validate agents if provided
    if (body.agents !== undefined) {
      if (!Array.isArray(body.agents) || body.agents.length === 0) {
        return NextResponse.json(
          { error: 'At least one agent is required in the team' },
          { status: 400 }
        );
      }

      for (const agent of body.agents) {
        if (!agent.agentId || !agent.role) {
          return NextResponse.json(
            { error: 'Each agent must have agentId and role' },
            { status: 400 }
          );
        }
      }
    }

    // Validate workflow if provided
    if (body.workflow !== undefined) {
      const validWorkflowTypes = ['sequential', 'parallel', 'conditional'];
      if (!validWorkflowTypes.includes(body.workflow.type)) {
        return NextResponse.json(
          { error: 'Workflow type must be one of: sequential, parallel, conditional' },
          { status: 400 }
        );
      }

      if (!body.workflow.steps || !Array.isArray(body.workflow.steps)) {
        return NextResponse.json(
          { error: 'Workflow must have steps array' },
          { status: 400 }
        );
      }
    }

    const updatedTeam: Team = {
      ...existingTeam,
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.agents !== undefined && { agents: body.agents }),
      ...(body.workflow !== undefined && { workflow: body.workflow }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
      updatedAt: new Date().toISOString(),
    };

    teams.set(id, updatedTeam);

    return NextResponse.json({ data: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update team' },
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
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const existingTeam = teams.get(id);

    if (!existingTeam) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // TODO: Verify user owns this team
    // const userId = getCurrentUserId();
    // if (existingTeam.creatorId !== userId) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // TODO: Check if team has active deployments before deleting

    teams.delete(id);

    return NextResponse.json(
      { data: { deleted: true }, message: 'Team deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    );
  }
}
