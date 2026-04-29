import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import {
  reserveStock,
  cancelPreviousReservations,
  releaseStock,
} from "@/services/inventory-service";

/**
 * POST /api/checkout
 * 
 * Deterministic flow:
 * 1. Validate session
 * 2. Cancel previous active reservations for this product
 * 3. Reserve stock (atomic RPC)
 * 4. Get product details
 * 5. Create Stripe Checkout Session
 * 6. Link stripe_session_id to reservation
 * 7. Fallback: release stock on any failure
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validate session
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Use admin client for RPC calls (bypasses RLS)
    const admin = createSupabaseAdmin();

    // 2. Cancel previous active reservations (1 user + 1 product = max 1 active)
    await cancelPreviousReservations(admin, user.id, productId);

    // 3. Reserve stock (atomic)
    let reservationId: string;
    try {
      reservationId = await reserveStock(admin, user.id, productId, quantity);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message === "STOCK_UNAVAILABLE") {
        return NextResponse.json(
          { error: "No hay stock disponible para este producto" },
          { status: 409 }
        );
      }
      throw err;
    }

    // 4. Get product details
    const { data: product, error: productError } = await admin
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      // Rollback: release the reservation
      await releaseStock(admin, reservationId);
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // 5. Create Stripe Checkout Session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: product.currency || "mxn",
              product_data: {
                name: product.name,
                description: product.description || undefined,
                images: product.image_url
                  ? [`${process.env.NEXT_PUBLIC_BASE_URL}${product.image_url}`]
                  : undefined,
              },
              unit_amount: product.price_cents,
            },
            quantity,
          },
        ],
        metadata: {
          user_id: user.id,
          product_id: productId,
          reservation_id: reservationId,
          quantity: String(quantity),
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda`,
        expires_at: Math.floor(Date.now() / 1000) + 900, // 15 min (matches reservation TTL)
      });
    } catch (stripeError) {
      // Rollback: release the reservation
      await releaseStock(admin, reservationId);
      throw stripeError;
    }

    // 6. Link Stripe session to reservation
    await admin
      .from("product_reservations")
      .update({ stripe_session_id: session.id })
      .eq("id", reservationId);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("[CHECKOUT ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
