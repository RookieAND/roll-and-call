import { createSupabaseBrowserClient } from "@/shared/api";

export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signOut();
}
