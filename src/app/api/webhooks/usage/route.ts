import { NextRequest, NextResponse } from 'next/server';
import type { UsageWebhookPayload, ApiResponse } from '@/types';

// Shared secret for webhook authentication
const USAGE_WEBHOOK_SECRET = process.env.USAGE_WEBHOOK_SECRET;

interface UsageResult {
  processed: boolean;
  deploymentId: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<UsageResult>>> {
  try {
    // Verify webhook authentication
    const authHeader = request.headers.get('authorization');
    const webhookSignature = request.headers.get('x-webhook-signature');

    if (!USAGE_WEBHOOK_SECRET) {
      console.error('USAGE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Check for Bearer token authentication
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (token !== USAGE_WEBHOOK_SECRET) {
        return NextResponse.json(
          { error: 'Invalid authorization token' },
          { status: 401 }
        );
      }
    } else if (webhookSignature) {
      // Alternative: HMAC signature verification
      const body = await request.clone().text();
      const isValid = await verifySignature(body, webhookSignature);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Missing authentication' },
        { status: 401 }
      );
    }

    const payload: UsageWebhookPayload = await request.json();

    // Validate required fields
    if (!payload.deploymentId) {
      return NextResponse.json(
        { error: 'Missing required field: deploymentId' },
        { status: 400 }
      );
    }

    if (!payload.userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    if (!payload.teamId) {
      return NextResponse.json(
        { error: 'Missing required field: teamId' },
        { status: 400 }
      );
    }

    if (!payload.usage) {
      return NextResponse.json(
        { error: 'Missing required field: usage' },
        { status: 400 }
      );
    }

    // Validate usage data
    const { tokens, requests, computeTimeMs } = payload.usage;

    if (typeof tokens !== 'number' || tokens < 0) {
      return NextResponse.json(
        { error: 'Invalid usage.tokens: must be a non-negative number' },
        { status: 400 }
      );
    }

    if (typeof requests !== 'number' || requests < 0) {
      return NextResponse.json(
        { error: 'Invalid usage.requests: must be a non-negative number' },
        { status: 400 }
      );
    }

    if (typeof computeTimeMs !== 'number' || computeTimeMs < 0) {
      return NextResponse.json(
        { error: 'Invalid usage.computeTimeMs: must be a non-negative number' },
        { status: 400 }
      );
    }

    // Process the usage data
    await processUsage(payload);

    return NextResponse.json({
      data: {
        processed: true,
        deploymentId: payload.deploymentId,
      },
      message: 'Usage data processed successfully',
    });
  } catch (error) {
    console.error('Error processing usage webhook:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process usage data' },
      { status: 500 }
    );
  }
}

async function verifySignature(
  body: string,
  signature: string
): Promise<boolean> {
  if (!USAGE_WEBHOOK_SECRET) {
    return false;
  }

  try {
    // HMAC-SHA256 signature verification
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(USAGE_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

async function processUsage(payload: UsageWebhookPayload): Promise<void> {
  console.log('Processing usage data:', {
    deploymentId: payload.deploymentId,
    userId: payload.userId,
    teamId: payload.teamId,
    usage: payload.usage,
    timestamp: payload.timestamp,
  });

  // TODO: Implement your business logic here

  // 1. Record usage in database
  // await db.insert(usageRecords).values({
  //   deploymentId: payload.deploymentId,
  //   userId: payload.userId,
  //   teamId: payload.teamId,
  //   tokens: payload.usage.tokens,
  //   requests: payload.usage.requests,
  //   computeTimeMs: payload.usage.computeTimeMs,
  //   timestamp: payload.timestamp,
  // });

  // 2. Update aggregated usage metrics
  // await updateUsageMetrics(payload.userId, payload.usage);

  // 3. Check usage limits and quotas
  // const userQuota = await getUserQuota(payload.userId);
  // if (hasExceededQuota(userQuota, payload.usage)) {
  //   await notifyUsageLimit(payload.userId);
  // }

  // 4. Calculate and track billing for usage-based pricing
  // const usageCost = calculateUsageCost(payload.usage);
  // await recordBillableUsage(payload.userId, usageCost);

  // 5. Update Stripe meter for usage-based billing
  // await stripe.billing.meterEvents.create({
  //   event_name: 'agent_usage',
  //   payload: {
  //     stripe_customer_id: stripeCustomerId,
  //     value: payload.usage.tokens.toString(),
  //   },
  // });

  // 6. Notify creator of agent/team usage (for royalty tracking)
  // await trackCreatorRoyalties(payload.teamId, payload.usage);
}
