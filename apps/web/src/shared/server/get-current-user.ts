import "server-only";
import { createSupabaseServerClient } from "./create-supabase-server-client";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
