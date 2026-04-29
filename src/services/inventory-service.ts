import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Inventory Service — Atomic Stock Management
 * 
 * All mutations go through PostgreSQL RPCs to guarantee
 * atomicity and invariant enforcement.
 */

/** Reserve stock for a product (15 min TTL) */
export async function reserveStock(
  supabase: SupabaseClient,
  userId: string,
  productId: string,
  qty: number
): Promise<string> {
  const { data, error } = await supabase.rpc("reserve_stock", {
    p_user: userId,
    p_product: productId,
    p_qty: qty,
  });

  if (error) {
    // Map PostgreSQL exceptions to user-friendly errors
    if (error.message.includes("No stock available")) {
      throw new Error("STOCK_UNAVAILABLE");
    }
    throw new Error(`RESERVATION_FAILED: ${error.message}`);
  }

  return data as string; // reservation_id
}

/** Release stock from a reservation */
export async function releaseStock(
  supabase: SupabaseClient,
  reservationId: string
): Promise<void> {
  const { error } = await supabase.rpc("release_stock", {
    p_reservation: reservationId,
  });

  if (error) {
    throw new Error(`RELEASE_FAILED: ${error.message}`);
  }
}

/** Cancel all active reservations for a user+product combo */
export async function cancelPreviousReservations(
  supabase: SupabaseClient,
  userId: string,
  productId: string
): Promise<void> {
  // Get active reservations to release stock properly
  const { data: activeReservations } = await supabase
    .from("product_reservations")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("status", "active");

  if (activeReservations) {
    for (const reservation of activeReservations) {
      await releaseStock(supabase, reservation.id);
    }
  }
}

/** Process an order atomically via RPC */
export async function processOrder(
  supabase: SupabaseClient,
  userId: string,
  reservationId: string,
  amount: number,
  paymentIntentId: string
): Promise<string> {
  const { data, error } = await supabase.rpc("process_order_tx", {
    p_user: userId,
    p_reservation: reservationId,
    p_amount: amount,
    p_pi: paymentIntentId,
  });

  if (error) {
    throw new Error(`ORDER_PROCESSING_FAILED: ${error.message}`);
  }

  return data as string; // order_id
}
