import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/server";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  // open-redirect guard: only allow same-origin relative paths ("//host", "/\host" are protocol-relative)
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) next = "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // behind Vercel's proxy the real host is in x-forwarded-host
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      if (!isLocal && forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
