import { SESSION_ROLE, type SessionRole } from "@/entities/game";

import { ONGOING_CHIP, type SessionChipKey } from "./session-tabs";

// 기본 탭(참여)·기본 칩(진행 중)은 주소에 남기지 않는다.
export function sessionsHref(role: SessionRole, status?: SessionChipKey): string {
  const searchParams = new URLSearchParams();
  if (role !== SESSION_ROLE.player) searchParams.set("tab", role);
  if (status && status !== ONGOING_CHIP) searchParams.set("status", status);
  const query = searchParams.toString();
  return query ? `/me/sessions?${query}` : "/me/sessions";
}
