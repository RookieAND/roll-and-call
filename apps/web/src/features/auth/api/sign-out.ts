import { createSupabaseBrowserClient } from "@/shared/api";

export async function signOut(): Promise<{ ok: boolean }> {
  try {
    const { error } = await createSupabaseBrowserClient().auth.signOut();
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
