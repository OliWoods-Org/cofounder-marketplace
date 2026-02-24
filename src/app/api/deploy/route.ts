import { NextRequest, NextResponse } from 'next/server';
import { deployToCoFounder, CoFounderApiError } from '@/lib/cofounder-api';
import type { DeployRequest, DeployResponse, ApiResponse } from '@/types';

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DeployResponse>>> {
  try {
    const body: DeployRequest = await request.json();

    // Validate required fields
    if (!body.teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    // Validate environment if provided
    if (body.environment && !['production', 'staging'].includes(body.environment)) {
      return NextResponse.json(
        { error: 'Environment must be either "production" or "staging"' },
        { status: 400 }
      );
    }

    // Validate config if provided
    if (body.config) {
      if (body.config.maxConcurrency !== undefined && body.config.maxConcurrency < 1) {
        return NextResponse.json(
          { error: 'maxConcurrency must be at least 1' },
          { status: 400 }
        );
      }

      if (body.config.timeout !== undefined && body.config.timeout < 1000) {
        return NextResponse.json(
          { error: 'timeout must be at least 1000ms' },
          { status: 400 }
        );
      }

      if (body.config.retryPolicy) {
        if (body.config.retryPolicy.maxRetries < 0) {
          return NextResponse.json(
            { error: 'maxRetries cannot be negative' },
            { status: 400 }
          );
        }
        if (body.config.retryPolicy.backoffMs < 100) {
          return NextResponse.json(
            { error: 'backoffMs must be at least 100ms' },
            { status: 400 }
          );
        }
      }
    }

    // TODO: Verify user has permission to deploy this team
    // TODO: Verify team exists and is valid
    // TODO: Check if user has sufficient credits/subscription

    // Call CoFounder API to deploy
    const deploymentResult = await deployToCoFounder({
      teamId: body.teamId,
      environment: body.environment,
      config: body.config as Record<string, unknown> | undefined,
    });

    const response: DeployResponse = {
      deploymentId: deploymentResult.deploymentId,
      status: deploymentResult.status as DeployResponse['status'],
      url: deploymentResult.url,
      createdAt: deploymentResult.createdAt,
    };

    return NextResponse.json(
      { data: response, message: 'Deployment initiated successfully' },
      { status: 202 }
    );
  } catch (error) {
    console.error('Error deploying team:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (error instanceof CoFounderApiError) {
      // Map CoFounder API errors to appropriate HTTP responses
      if (error.statusCode === 401 || error.statusCode === 403) {
        return NextResponse.json(
          { error: 'Not authorized to deploy' },
          { status: error.statusCode }
        );
      }

      if (error.statusCode === 404) {
        return NextResponse.json(
          { error: 'Team not found in CoFounder' },
          { status: 404 }
        );
      }

      if (error.statusCode === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to deploy team' },
      { status: 500 }
    );
  }
}
