import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import {
  insertEvent,
  lockEvent,
  markProcessed,
  markFailed,
} from "@/services/stripe-ledger";
import { processOrder, releaseStock } from "@/services/inventory-service";
import {
  syncMembership,
  handlePaymentFailed,
} from "@/services/membership-service";
import Stripe from "stripe";

/**
 * POST /api/webhook
 * 
 * Deterministic flow:
 * 1. Verify Stripe signature
 * 2. Insert event in ledger (received) — idempotent
 * 3. Lock event (processing) — atomic
 * 4. Execute business logic
 * 5. Mark processed or failed
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // 1. Verify Stripe signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[WEBHOOK] Signature verification failed:", message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const admin = createSupabaseAdmin();

  // 2. Insert event in ledger (idempotent)
  await insertEvent(admin, event);

  // 3. Lock event for processing (atomic)
  const locked = await lockEvent(admin, event.id);
  if (!locked) {
    // Already processed or being processed by another worker
    return NextResponse.json({ received: true });
  }

  // 4. Execute business logic based on event type
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const md = session.metadata;

        if (!md?.user_id || !md?.reservation_id) {
          throw new Error("Missing required metadata in checkout session");
        }

        // Validate the session was actually paid
        if (session.payment_status !== "paid") {
          throw new Error(`Unexpected payment_status: ${session.payment_status}`);
        }

        await processOrder(
          admin,
          md.user_id,
          md.reservation_id,
          session.amount_total || 0,
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || ""
        );
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const md = session.metadata;

        if (md?.reservation_id) {
          await releaseStock(admin, md.reservation_id);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncMembership(admin, subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(admin, invoice);
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    // 5. Mark as processed
    await markProcessed(admin, event.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[WEBHOOK] Processing failed for ${event.id}:`, message);

    // 5. Mark as failed (allows retry)
    await markFailed(admin, event.id, message);
  }

  // Always return 200 to Stripe to prevent retries (we handle retries internally)
  return NextResponse.json({ received: true });
}
