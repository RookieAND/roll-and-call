import "server-only";
import { cache } from "react";

import { createSupabaseServerClient } from "./create-supabase-server-client";

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
