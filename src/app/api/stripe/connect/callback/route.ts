import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getConnectAccountStatus, createAccountLink } from '@/lib/stripe';

/**
 * GET /api/stripe/connect/callback
 * Handle the OAuth callback from Stripe Connect onboarding
 * Redirects user to the appropriate page based on onboarding status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', '/dashboard');
      return NextResponse.redirect(signInUrl);
    }

    const { searchParams } = new URL(request.url);
    const isSuccess = searchParams.get('success') === 'true';
    const isRefresh = searchParams.get('refresh') === 'true';
    const accountId = searchParams.get('account_id');

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const dashboardUrl = new URL('/dashboard', baseUrl);

    // If this is a refresh request, the user needs to restart onboarding
    if (isRefresh && accountId) {
      try {
        const refreshUrl = `${baseUrl}/api/stripe/connect/callback?refresh=true&account_id=${accountId}`;
        const returnUrl = `${baseUrl}/api/stripe/connect/callback?success=true&account_id=${accountId}`;

        const newOnboardingUrl = await createAccountLink(
          accountId,
          refreshUrl,
          returnUrl
        );

        return NextResponse.redirect(newOnboardingUrl);
      } catch (error) {
        console.error('Error creating new account link:', error);
        dashboardUrl.searchParams.set('stripe_error', 'onboarding_failed');
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // If this is a success callback
    if (isSuccess) {
      if (accountId) {
        try {
          const status = await getConnectAccountStatus(accountId);

          if (status.isOnboarded && status.chargesEnabled) {
            // Successfully onboarded
            dashboardUrl.searchParams.set('stripe_connected', 'true');

            // TODO: Update user record in database
            // await db.update(users)
            //   .set({ stripeAccountStatus: 'active' })
            //   .where(eq(users.id, userId));

            console.log(
              `User ${userId} completed Stripe Connect onboarding for account ${accountId}`
            );
          } else {
            // Onboarding not complete - additional info may be needed
            dashboardUrl.searchParams.set('stripe_pending', 'true');
            console.log(
              `User ${userId} has pending requirements for account ${accountId}`
            );
          }
        } catch (error) {
          console.error('Error checking account status:', error);
          dashboardUrl.searchParams.set('stripe_error', 'status_check_failed');
        }
      } else {
        dashboardUrl.searchParams.set('stripe_connected', 'true');
      }

      return NextResponse.redirect(dashboardUrl);
    }

    // Default redirect to dashboard
    return NextResponse.redirect(dashboardUrl);
  } catch (error) {
    console.error('Error in Connect callback:', error);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const errorUrl = new URL('/dashboard', baseUrl);
    errorUrl.searchParams.set('stripe_error', 'callback_failed');

    return NextResponse.redirect(errorUrl);
  }
}
