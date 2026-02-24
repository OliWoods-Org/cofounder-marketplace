import Stripe from 'stripe';

// Lazy-initialized Stripe client to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) {
    return stripeInstance;
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  stripeInstance = new Stripe(key, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
  });

  return stripeInstance;
}

// Revenue split configuration: 70% to builder, 30% to platform
export const REVENUE_SPLIT = {
  BUILDER_PERCENTAGE: 70,
  PLATFORM_PERCENTAGE: 30,
} as const;

/**
 * Calculate the revenue split for a purchase
 * @param amountInCents - Total purchase amount in cents
 * @returns Object containing builder amount and platform fee in cents
 */
export function calculateRevenueSplit(amountInCents: number): {
  builderAmount: number;
  platformFee: number;
} {
  const builderAmount = Math.floor(
    (amountInCents * REVENUE_SPLIT.BUILDER_PERCENTAGE) / 100
  );
  const platformFee = amountInCents - builderAmount;

  return {
    builderAmount,
    platformFee,
  };
}

/**
 * Create a Stripe Connect account for a builder
 * @param userId - The user's internal ID
 * @param email - The user's email address
 * @returns The created Connect account
 */
export async function createConnectAccount(
  userId: string,
  email: string
): Promise<Stripe.Account> {
  const stripe = getStripe();

  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: {
      userId,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

/**
 * Create an account link for Stripe Connect onboarding
 * @param accountId - The Stripe Connect account ID
 * @param refreshUrl - URL to redirect if link expires
 * @param returnUrl - URL to redirect after onboarding
 * @returns The account link URL
 */
export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripe();

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });

  return accountLink.url;
}

/**
 * Get the status of a Connect account
 * @param accountId - The Stripe Connect account ID
 * @returns The account details
 */
export async function getConnectAccountStatus(
  accountId: string
): Promise<{
  isOnboarded: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}> {
  const stripe = getStripe();

  const account = await stripe.accounts.retrieve(accountId);

  return {
    isOnboarded: account.details_submitted ?? false,
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
    detailsSubmitted: account.details_submitted ?? false,
  };
}

/**
 * Create a checkout session with destination charges for marketplace purchases
 * @param params - Checkout session parameters
 * @returns The checkout session
 */
export async function createCheckoutSessionWithDestination(params: {
  priceInCents: number;
  productName: string;
  productDescription?: string;
  connectedAccountId: string;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  const { builderAmount, platformFee } = calculateRevenueSplit(
    params.priceInCents
  );

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: params.productName,
            description: params.productDescription,
          },
          unit_amount: params.priceInCents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: params.connectedAccountId,
      },
      metadata: {
        ...params.metadata,
        builderAmount: builderAmount.toString(),
        platformFee: platformFee.toString(),
      },
    },
    customer: params.customerId,
    customer_email: params.customerId ? undefined : params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      ...params.metadata,
      connectedAccountId: params.connectedAccountId,
    },
  });

  return session;
}

/**
 * Create a transfer to a connected account
 * Used for manual transfers outside of destination charges
 * @param params - Transfer parameters
 * @returns The transfer object
 */
export async function createTransferToConnectedAccount(params: {
  amountInCents: number;
  connectedAccountId: string;
  sourceTransaction?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Transfer> {
  const stripe = getStripe();

  const transfer = await stripe.transfers.create({
    amount: params.amountInCents,
    currency: 'usd',
    destination: params.connectedAccountId,
    source_transaction: params.sourceTransaction,
    metadata: params.metadata,
  });

  return transfer;
}

/**
 * Retrieve a Connect account by ID
 * @param accountId - The Stripe Connect account ID
 * @returns The account object
 */
export async function getConnectAccount(
  accountId: string
): Promise<Stripe.Account> {
  const stripe = getStripe();
  return stripe.accounts.retrieve(accountId);
}

/**
 * Create a login link for the Express Dashboard
 * @param accountId - The Stripe Connect account ID
 * @returns The login link URL
 */
export async function createExpressDashboardLink(
  accountId: string
): Promise<string> {
  const stripe = getStripe();

  const loginLink = await stripe.accounts.createLoginLink(accountId);

  return loginLink.url;
}
