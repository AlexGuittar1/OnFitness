import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}

export async function GET() {
  return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}
