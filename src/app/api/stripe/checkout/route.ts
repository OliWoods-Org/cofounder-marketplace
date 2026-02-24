import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createCheckoutSessionWithDestination, REVENUE_SPLIT } from '@/lib/stripe';
import type { ApiResponse } from '@/types';

const checkoutRequestSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productType: z.enum(['agent', 'team']),
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().optional(),
  priceInCents: z.number().int().positive('Price must be a positive integer'),
  connectedAccountId: z.string().min(1, 'Connected account ID is required'),
  builderId: z.string().min(1, 'Builder ID is required'),
});

type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

interface CheckoutResponse {
  sessionId: string;
  url: string;
  revenueSplit: {
    totalAmount: number;
    builderAmount: number;
    platformFee: number;
    builderPercentage: number;
    platformPercentage: number;
  };
}

/**
 * POST /api/stripe/checkout
 * Create a checkout session for purchasing an agent or team
 * Uses destination charges to split revenue with the builder
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CheckoutResponse>>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = checkoutRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: validationResult.error.errors
            .map((e) => e.message)
            .join(', '),
        },
        { status: 400 }
      );
    }

    const data: CheckoutRequest = validationResult.data;

    // Prevent users from purchasing their own products
    if (data.builderId === userId) {
      return NextResponse.json(
        { error: 'You cannot purchase your own products' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const successUrl = `${baseUrl}/marketplace/purchase/success?session_id={CHECKOUT_SESSION_ID}&product_id=${data.productId}&product_type=${data.productType}`;
    const cancelUrl = `${baseUrl}/marketplace/${data.productType}s/${data.productId}?checkout_cancelled=true`;

    // Create checkout session with destination charges
    const session = await createCheckoutSessionWithDestination({
      priceInCents: data.priceInCents,
      productName: data.productName,
      productDescription: data.productDescription,
      connectedAccountId: data.connectedAccountId,
      successUrl,
      cancelUrl,
      metadata: {
        productId: data.productId,
        productType: data.productType,
        buyerId: userId,
        builderId: data.builderId,
      },
    });

    // Calculate revenue split for response
    const builderAmount = Math.floor(
      (data.priceInCents * REVENUE_SPLIT.BUILDER_PERCENTAGE) / 100
    );
    const platformFee = data.priceInCents - builderAmount;

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        sessionId: session.id,
        url: session.url,
        revenueSplit: {
          totalAmount: data.priceInCents,
          builderAmount,
          platformFee,
          builderPercentage: REVENUE_SPLIT.BUILDER_PERCENTAGE,
          platformPercentage: REVENUE_SPLIT.PLATFORM_PERCENTAGE,
        },
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create checkout session';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/checkout
 * Get details about the revenue split for a given price
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ revenueSplit: CheckoutResponse['revenueSplit'] }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const priceParam = searchParams.get('price');

    if (!priceParam) {
      return NextResponse.json(
        { error: 'Price parameter is required' },
        { status: 400 }
      );
    }

    const priceInCents = parseInt(priceParam, 10);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive integer' },
        { status: 400 }
      );
    }

    const builderAmount = Math.floor(
      (priceInCents * REVENUE_SPLIT.BUILDER_PERCENTAGE) / 100
    );
    const platformFee = priceInCents - builderAmount;

    return NextResponse.json({
      data: {
        revenueSplit: {
          totalAmount: priceInCents,
          builderAmount,
          platformFee,
          builderPercentage: REVENUE_SPLIT.BUILDER_PERCENTAGE,
          platformPercentage: REVENUE_SPLIT.PLATFORM_PERCENTAGE,
        },
      },
    });
  } catch (error) {
    console.error('Error calculating revenue split:', error);

    return NextResponse.json(
      { error: 'Failed to calculate revenue split' },
      { status: 500 }
    );
  }
}
