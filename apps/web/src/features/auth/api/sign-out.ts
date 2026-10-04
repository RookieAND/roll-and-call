import { createSupabaseBrowserClient } from "@/shared/api";

export async function signOut(): Promise<{ ok: boolean }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { ok: !error };
}
