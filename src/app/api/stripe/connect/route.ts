import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  createConnectAccount,
  createAccountLink,
  getConnectAccountStatus,
  createExpressDashboardLink,
} from '@/lib/stripe';
import type { ApiResponse } from '@/types';

interface ConnectAccountResponse {
  accountId: string;
  onboardingUrl?: string;
  dashboardUrl?: string;
  status: {
    isOnboarded: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
  };
}

/**
 * POST /api/stripe/connect
 * Create a new Stripe Connect account for the authenticated builder
 * or return existing account status with onboarding/dashboard link
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ConnectAccountResponse>>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    const email = user.emailAddresses[0].emailAddress;

    // Parse request body to check for existing account ID
    let existingAccountId: string | undefined;
    try {
      const body = await request.json();
      existingAccountId = body.stripeAccountId;
    } catch {
      // No body or invalid JSON, proceed with creating new account
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const refreshUrl = `${baseUrl}/api/stripe/connect/callback?refresh=true`;
    const returnUrl = `${baseUrl}/api/stripe/connect/callback?success=true`;

    // If user already has a Connect account, check status and return appropriate URL
    if (existingAccountId) {
      const status = await getConnectAccountStatus(existingAccountId);

      // If onboarded, provide dashboard link
      if (status.isOnboarded && status.chargesEnabled) {
        const dashboardUrl = await createExpressDashboardLink(existingAccountId);

        return NextResponse.json({
          data: {
            accountId: existingAccountId,
            dashboardUrl,
            status: {
              isOnboarded: status.isOnboarded,
              chargesEnabled: status.chargesEnabled,
              payoutsEnabled: status.payoutsEnabled,
            },
          },
        });
      }

      // If not fully onboarded, create new onboarding link
      const onboardingUrl = await createAccountLink(
        existingAccountId,
        refreshUrl,
        returnUrl
      );

      return NextResponse.json({
        data: {
          accountId: existingAccountId,
          onboardingUrl,
          status: {
            isOnboarded: status.isOnboarded,
            chargesEnabled: status.chargesEnabled,
            payoutsEnabled: status.payoutsEnabled,
          },
        },
      });
    }

    // Create new Connect account
    const account = await createConnectAccount(userId, email);

    // Create onboarding link
    const onboardingUrl = await createAccountLink(
      account.id,
      refreshUrl,
      returnUrl
    );

    // TODO: Save account.id to your database associated with the user
    // await db.update(users).set({ stripeAccountId: account.id }).where(eq(users.id, userId));

    console.log(
      `Created Stripe Connect account ${account.id} for user ${userId}`
    );

    return NextResponse.json({
      data: {
        accountId: account.id,
        onboardingUrl,
        status: {
          isOnboarded: false,
          chargesEnabled: false,
          payoutsEnabled: false,
        },
      },
    });
  } catch (error) {
    console.error('Error creating Connect account:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create Connect account';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/connect
 * Get the status of the current user's Connect account
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ConnectAccountResponse>>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get account ID from query params
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const status = await getConnectAccountStatus(accountId);

    const response: ConnectAccountResponse = {
      accountId,
      status: {
        isOnboarded: status.isOnboarded,
        chargesEnabled: status.chargesEnabled,
        payoutsEnabled: status.payoutsEnabled,
      },
    };

    // If fully onboarded, include dashboard link
    if (status.isOnboarded && status.chargesEnabled) {
      response.dashboardUrl = await createExpressDashboardLink(accountId);
    }

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('Error getting Connect account status:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to get account status';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
