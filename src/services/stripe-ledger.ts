import { SupabaseClient } from "@supabase/supabase-js";
import type { StripeEventLedger } from "@/lib/types";
import Stripe from "stripe";

/**
 * Ledger Service — Stripe Event State Machine
 * 
 * States: received → processing → processed | failed
 * Guarantees idempotent webhook processing via atomic locking.
 */

/** Insert a new event into the ledger (idempotent — ignores duplicates) */
export async function insertEvent(
  supabase: SupabaseClient,
  event: Stripe.Event
): Promise<void> {
  await supabase
    .from("stripe_event_ledger")
    .upsert(
      {
        id: event.id,
        type: event.type,
        status: "received",
        payload: event as unknown as Record<string, unknown>,
        attempts: 0,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
}

/**
 * Attempt to lock an event for processing.
 * Uses atomic UPDATE ... WHERE status IN ('received','failed') RETURNING *
 * Returns null if event is already being processed or was processed.
 */
export async function lockEvent(
  supabase: SupabaseClient,
  eventId: string
): Promise<StripeEventLedger | null> {
  const { data, error } = await supabase
    .from("stripe_event_ledger")
    .update({
      status: "processing",
      attempts: 1, // Will be incremented server-side in retry scenarios
    })
    .eq("id", eventId)
    .in("status", ["received", "failed"])
    .select()
    .single();

  if (error || !data) return null;
  return data as StripeEventLedger;
}

/** Mark event as successfully processed */
export async function markProcessed(
  supabase: SupabaseClient,
  eventId: string
): Promise<void> {
  await supabase
    .from("stripe_event_ledger")
    .update({ status: "processed", error_message: null })
    .eq("id", eventId);
}

/** Mark event as failed with error details */
export async function markFailed(
  supabase: SupabaseClient,
  eventId: string,
  errorMessage: string
): Promise<void> {
  await supabase
    .from("stripe_event_ledger")
    .update({ status: "failed", error_message: errorMessage })
    .eq("id", eventId);
}
