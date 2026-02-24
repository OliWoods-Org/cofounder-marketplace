import { NextRequest, NextResponse } from 'next/server';
import type {
  Team,
  CreateTeamInput,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// Mock data store - replace with actual database calls
const teams: Map<string, Team> = new Map();

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<Team> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const creatorId = searchParams.get('creatorId');
    const isPublic = searchParams.get('isPublic');

    let filteredTeams = Array.from(teams.values());

    // Apply filters
    if (creatorId) {
      filteredTeams = filteredTeams.filter(
        (team) => team.creatorId === creatorId
      );
    }

    if (isPublic !== null) {
      filteredTeams = filteredTeams.filter(
        (team) => team.isPublic === (isPublic === 'true')
      );
    }

    // Sort by creation date (newest first)
    filteredTeams.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const total = filteredTeams.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedTeams = filteredTeams.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedTeams,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Team>>> {
  try {
    const body: CreateTeamInput = await request.json();

    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description' },
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

    // Validate agents array
    if (!body.agents || !Array.isArray(body.agents) || body.agents.length === 0) {
      return NextResponse.json(
        { error: 'At least one agent is required in the team' },
        { status: 400 }
      );
    }

    // Validate each agent entry
    for (const agent of body.agents) {
      if (!agent.agentId || !agent.role) {
        return NextResponse.json(
          { error: 'Each agent must have agentId and role' },
          { status: 400 }
        );
      }
    }

    // Validate workflow
    if (!body.workflow || !body.workflow.type || !body.workflow.steps) {
      return NextResponse.json(
        { error: 'Workflow with type and steps is required' },
        { status: 400 }
      );
    }

    const validWorkflowTypes = ['sequential', 'parallel', 'conditional'];
    if (!validWorkflowTypes.includes(body.workflow.type)) {
      return NextResponse.json(
        { error: 'Workflow type must be one of: sequential, parallel, conditional' },
        { status: 400 }
      );
    }

    // TODO: Get actual user ID from authentication
    const creatorId = 'user_placeholder';

    const now = new Date().toISOString();
    const team: Team = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description,
      agents: body.agents,
      workflow: body.workflow,
      price: body.price || 0,
      creatorId,
      isPublic: body.isPublic ?? false,
      createdAt: now,
      updatedAt: now,
    };

    teams.set(team.id, team);

    return NextResponse.json({ data: team }, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
