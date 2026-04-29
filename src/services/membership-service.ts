import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

/**
 * Membership Service — Stripe Subscription Sync
 * 
 * Source of truth: Stripe price_id determines plan level.
 * Syncs on: customer.subscription.created|updated|deleted
 */

export async function syncMembership(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription
): Promise<void> {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    throw new Error("MISSING_USER_ID_IN_METADATA");
  }

  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) {
    throw new Error("MISSING_PRICE_ID");
  }

  // Find matching plan
  const { data: plan } = await supabase
    .from("plans")
    .select("id")
    .eq("stripe_price_id", priceId)
    .single();

  // Stripe SDK v22 moves period fields — extract safely
  const sub = subscription as unknown as Record<string, unknown>;
  const periodStart = typeof sub.current_period_start === "number"
    ? new Date(sub.current_period_start * 1000).toISOString()
    : null;
  const periodEnd = typeof sub.current_period_end === "number"
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  await supabase
    .from("memberships")
    .upsert(
      {
        user_id: userId,
        plan_id: plan?.id || null,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        price_id: priceId,
        status: subscription.status,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
      },
      { onConflict: "stripe_subscription_id" }
    );
}

/** Handle invoice payment failure */
export async function handlePaymentFailed(
  supabase: SupabaseClient,
  invoice: Stripe.Invoice
): Promise<void> {
  // Stripe SDK v22 — safely extract subscription
  const inv = invoice as unknown as Record<string, unknown>;
  const subscriptionId =
    typeof inv.subscription === "string"
      ? inv.subscription
      : typeof inv.subscription === "object" && inv.subscription !== null
        ? (inv.subscription as Record<string, string>).id
        : null;

  if (!subscriptionId) return;

  await supabase
    .from("memberships")
    .update({ status: "past_due" })
    .eq("stripe_subscription_id", subscriptionId);
}

/** Check if a membership is currently valid */
export function isMembershipValid(membership: {
  status: string;
  current_period_end: string | null;
}): boolean {
  if (membership.status !== "active") return false;
  if (!membership.current_period_end) return false;
  return new Date(membership.current_period_end) > new Date();
}
