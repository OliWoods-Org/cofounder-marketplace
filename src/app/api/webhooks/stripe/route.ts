import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { ApiResponse } from '@/types';
import { getStripe, calculateRevenueSplit } from '@/lib/stripe';

interface WebhookResult {
  received: boolean;
  eventType: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<WebhookResult>>> {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      // Stripe Connect events
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      case 'account.application.authorized': {
        const application = event.data.object as Stripe.Application;
        await handleApplicationAuthorized(application);
        break;
      }

      case 'account.application.deauthorized': {
        const application = event.data.object as Stripe.Application;
        await handleApplicationDeauthorized(application);
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        await handleTransferCreated(transfer);
        break;
      }

      case 'transfer.updated': {
        const transfer = event.data.object as Stripe.Transfer;
        await handleTransferUpdated(transfer);
        break;
      }

      case 'transfer.reversed': {
        const transfer = event.data.object as Stripe.Transfer;
        await handleTransferReversed(transfer);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({
      data: {
        received: true,
        eventType: event.type,
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handler functions for different Stripe events

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log('Checkout session completed:', session.id);

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const metadata = session.metadata || {};

  // Check if this is a marketplace purchase (has connectedAccountId)
  if (metadata.connectedAccountId) {
    await processMarketplacePurchaseTransfer(session);
    return;
  }

  // Handle regular subscription/checkout
  // TODO: Implement your business logic here
  // - Update user's subscription status in database
  // - Grant access to purchased team/agent
  // - Send confirmation email

  console.log('Processing checkout for customer:', customerId);
  console.log('Subscription ID:', subscriptionId);
  console.log('Metadata:', metadata);
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const status = subscription.status;
  const priceId = subscription.items.data[0]?.price.id;

  // TODO: Implement your business logic here
  // - Create subscription record in database
  // - Set user's plan level based on price ID

  console.log('Customer:', customerId);
  console.log('Status:', status);
  console.log('Price ID:', priceId);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription updated:', subscription.id);

  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  // TODO: Implement your business logic here
  // - Update subscription status in database
  // - Handle plan upgrades/downgrades
  // - Handle cancellation scheduling

  console.log('Status:', status);
  console.log('Cancel at period end:', cancelAtPeriodEnd);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription deleted:', subscription.id);

  const customerId = subscription.customer as string;

  // TODO: Implement your business logic here
  // - Mark subscription as cancelled in database
  // - Revoke access to premium features
  // - Send cancellation confirmation email

  console.log('Customer:', customerId);
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  console.log('Invoice paid:', invoice.id);

  const customerId = invoice.customer as string;
  const amountPaid = invoice.amount_paid;
  const subscriptionId = invoice.subscription as string;

  // TODO: Implement your business logic here
  // - Record payment in database
  // - Extend subscription period
  // - Send receipt email

  console.log('Customer:', customerId);
  console.log('Amount paid:', amountPaid);
  console.log('Subscription:', subscriptionId);
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log('Invoice payment failed:', invoice.id);

  const customerId = invoice.customer as string;
  const attemptCount = invoice.attempt_count;

  // TODO: Implement your business logic here
  // - Send payment failure notification
  // - Mark subscription as past_due
  // - Implement grace period logic

  console.log('Customer:', customerId);
  console.log('Attempt count:', attemptCount);
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log('Payment intent succeeded:', paymentIntent.id);

  const metadata = paymentIntent.metadata || {};
  const amount = paymentIntent.amount;

  // TODO: Implement your business logic here
  // - Handle one-time purchases (e.g., marketplace purchases)
  // - Update purchase records

  console.log('Amount:', amount);
  console.log('Metadata:', metadata);
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log('Payment intent failed:', paymentIntent.id);

  const lastPaymentError = paymentIntent.last_payment_error;

  // TODO: Implement your business logic here
  // - Log payment failure
  // - Notify user of failed payment

  console.log('Error:', lastPaymentError?.message);
}

// Stripe Connect event handlers

async function handleAccountUpdated(account: Stripe.Account): Promise<void> {
  console.log('Connect account updated:', account.id);

  const userId = account.metadata?.userId;
  const chargesEnabled = account.charges_enabled;
  const payoutsEnabled = account.payouts_enabled;
  const detailsSubmitted = account.details_submitted;

  // Determine account status
  let status: 'pending' | 'active' | 'restricted' | 'disabled' = 'pending';

  if (chargesEnabled && payoutsEnabled) {
    status = 'active';
  } else if (detailsSubmitted) {
    status = 'restricted';
  } else if (account.requirements?.disabled_reason) {
    status = 'disabled';
  }

  // TODO: Implement your business logic here
  // - Update builder's Stripe account status in database
  // - Send notification if account becomes active or has issues
  // Example:
  // await db.update(users)
  //   .set({
  //     stripeAccountStatus: status,
  //     stripeChargesEnabled: chargesEnabled,
  //     stripePayoutsEnabled: payoutsEnabled,
  //   })
  //   .where(eq(users.stripeAccountId, account.id));

  console.log('User ID:', userId);
  console.log('Account status:', status);
  console.log('Charges enabled:', chargesEnabled);
  console.log('Payouts enabled:', payoutsEnabled);
  console.log('Details submitted:', detailsSubmitted);

  if (account.requirements?.currently_due?.length) {
    console.log('Currently due requirements:', account.requirements.currently_due);
  }

  if (account.requirements?.errors?.length) {
    console.log('Account errors:', account.requirements.errors);
  }
}

async function handleApplicationAuthorized(
  application: Stripe.Application
): Promise<void> {
  console.log('Application authorized:', application.id);
  console.log('Application name:', application.name);

  // TODO: Implement your business logic here
  // - Log the authorization event
  // - Update builder's authorization status
}

async function handleApplicationDeauthorized(
  application: Stripe.Application
): Promise<void> {
  console.log('Application deauthorized:', application.id);
  console.log('Application name:', application.name);

  // TODO: Implement your business logic here
  // - Mark the builder's Stripe connection as revoked
  // - Disable their ability to receive payouts
  // - Notify the builder
  // Example:
  // await db.update(users)
  //   .set({
  //     stripeAccountId: null,
  //     stripeAccountStatus: 'disconnected',
  //   })
  //   .where(eq(users.stripeAccountId, application.id));
}

async function handleTransferCreated(transfer: Stripe.Transfer): Promise<void> {
  console.log('Transfer created:', transfer.id);

  const destination = transfer.destination as string;
  const amount = transfer.amount;
  const metadata = transfer.metadata || {};

  // TODO: Implement your business logic here
  // - Record the transfer in your database
  // - Associate with the original purchase/transaction
  // Example:
  // await db.insert(transfers).values({
  //   stripeTransferId: transfer.id,
  //   connectedAccountId: destination,
  //   amount,
  //   currency: transfer.currency,
  //   status: 'created',
  //   metadata,
  // });

  console.log('Destination account:', destination);
  console.log('Amount:', amount);
  console.log('Currency:', transfer.currency);
  console.log('Metadata:', metadata);
}

async function handleTransferUpdated(transfer: Stripe.Transfer): Promise<void> {
  console.log('Transfer updated:', transfer.id);

  const destination = transfer.destination as string;
  const amount = transfer.amount;
  const reversed = transfer.reversed;

  // TODO: Implement your business logic here
  // - Update transfer status in database
  // - Check if transfer was reversed or completed
  // Example:
  // await db.update(transfers)
  //   .set({
  //     status: reversed ? 'reversed' : 'completed',
  //     updatedAt: new Date()
  //   })
  //   .where(eq(transfers.stripeTransferId, transfer.id));

  console.log('Destination account:', destination);
  console.log('Amount:', amount);
  console.log('Reversed:', reversed);
}

async function handleTransferReversed(transfer: Stripe.Transfer): Promise<void> {
  console.log('Transfer reversed:', transfer.id);

  const destination = transfer.destination as string;
  const amount = transfer.amount;
  const reversals = transfer.reversals;

  // TODO: Implement your business logic here
  // - Update transfer status in database
  // - Handle refund/reversal logic
  // - Notify builder about the reversal
  // Example:
  // await db.update(transfers)
  //   .set({ status: 'reversed', reversedAt: new Date() })
  //   .where(eq(transfers.stripeTransferId, transfer.id));

  console.log('Destination account:', destination);
  console.log('Amount:', amount);
  console.log('Reversals:', reversals?.data?.length || 0);
}

/**
 * Process a marketplace purchase and create transfer to builder
 * This is called after a successful checkout for marketplace purchases
 */
async function processMarketplacePurchaseTransfer(
  session: Stripe.Checkout.Session
): Promise<void> {
  const metadata = session.metadata || {};
  const connectedAccountId = metadata.connectedAccountId;
  const productId = metadata.productId;
  const productType = metadata.productType;
  const buyerId = metadata.buyerId;
  const builderId = metadata.builderId;

  if (!connectedAccountId) {
    console.log('No connected account ID - not a marketplace purchase');
    return;
  }

  // For destination charges, the transfer is automatic
  // This function is mainly for logging and database updates
  const amountTotal = session.amount_total || 0;
  const { builderAmount, platformFee } = calculateRevenueSplit(amountTotal);

  console.log('Marketplace purchase completed:');
  console.log('- Product ID:', productId);
  console.log('- Product Type:', productType);
  console.log('- Buyer ID:', buyerId);
  console.log('- Builder ID:', builderId);
  console.log('- Total amount:', amountTotal);
  console.log('- Builder receives:', builderAmount);
  console.log('- Platform fee:', platformFee);
  console.log('- Connected account:', connectedAccountId);

  // TODO: Implement your business logic here
  // - Record the purchase in your database
  // - Grant access to the purchased agent/team
  // - Send confirmation emails to buyer and builder
  // Example:
  // await db.insert(purchases).values({
  //   productId,
  //   productType,
  //   buyerId,
  //   builderId,
  //   totalAmount: amountTotal,
  //   builderAmount,
  //   platformFee,
  //   stripeSessionId: session.id,
  //   stripePaymentIntentId: session.payment_intent as string,
  //   status: 'completed',
  // });
}
