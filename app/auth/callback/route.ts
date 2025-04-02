import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Exchange the code for a session (this will automatically update the session cookie)
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to a success page or dashboard
  return NextResponse.redirect(new URL("/auth/confirmed", request.url));
}
