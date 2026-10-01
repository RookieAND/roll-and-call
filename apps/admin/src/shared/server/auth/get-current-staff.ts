import "server-only";
import { cache } from "react";

import { getStaffRole, type StaffRole } from "../admin-data";
import { createSupabaseServerClient } from "./create-supabase-server-client";

export type CurrentStaff =
  | { status: "anonymous" }
  | { status: "denied"; nickname: string }
  | { status: "staff"; id: string; nickname: string; role: StaffRole };

export const getCurrentStaff = cache(async (): Promise<CurrentStaff> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" };

  const metadata = user.user_metadata as Record<string, string | undefined>;
  const nickname = metadata.full_name ?? metadata.name ?? user.email ?? "";
  const role = metadata.provider_id ? await getStaffRole(user.id, metadata.provider_id) : null;
  return role ? { status: "staff", id: user.id, nickname, role } : { status: "denied", nickname };
});
