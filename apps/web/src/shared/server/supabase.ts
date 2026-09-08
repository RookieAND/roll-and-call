import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Current authenticated user (or null). Wraps the getUser boilerplate repeated
// across server components.
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // ponytail: throws when called from a Server Component render; middleware refreshes the session so it's safe to swallow
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            /* no-op */
          }
        },
      },
    },
  );
}
