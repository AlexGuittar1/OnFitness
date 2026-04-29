import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

/**
 * POST /api/cron/cleanup-reservations
 * 
 * Releases expired reservations atomically.
 * Call this every 5-10 minutes via Supabase Edge Function, 
 * Vercel Cron, or external scheduler.
 * 
 * Protected by a shared secret to prevent unauthorized calls.
 */
export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const admin = createSupabaseAdmin();

    const { data, error } = await admin.rpc("release_expired_reservations");

    if (error) {
      console.error("[CRON] Cleanup failed:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const count = data as number;
    console.log(`[CRON] Released ${count} expired reservations`);

    return NextResponse.json({
      success: true,
      released: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
