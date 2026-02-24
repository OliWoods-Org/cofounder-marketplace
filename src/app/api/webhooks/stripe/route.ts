import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { ApiResponse } from '@/types';

// Lazy initialization to avoid build-time errors
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
  });
}

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
