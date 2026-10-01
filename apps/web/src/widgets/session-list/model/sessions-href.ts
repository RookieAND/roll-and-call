import { SESSION_ROLE, type SessionRole } from "@/entities/game";

import { ONGOING_CHIP, type SessionChipKey } from "./session-tabs";

export function sessionsHref({
  role,
  status,
}: {
  role: SessionRole;
  status?: SessionChipKey;
}): string {
  const searchParams = new URLSearchParams();
  if (role !== SESSION_ROLE.player) searchParams.set("tab", role);
  if (status && status !== ONGOING_CHIP) searchParams.set("status", status);
  const query = searchParams.toString();
  return query ? `/me/sessions?${query}` : "/me/sessions";
}
