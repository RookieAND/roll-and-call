import { createSupabaseBrowserClient } from "@/shared/api";
// Session teardown only. Callers handle post-signout navigation (router.refresh 등).
export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signOut();
}
