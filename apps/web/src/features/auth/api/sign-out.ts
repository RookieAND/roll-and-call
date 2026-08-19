import { createClient } from "@/shared/api/supabase/client";

// Session teardown only. Callers handle post-signout navigation (router.refresh 등).
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
