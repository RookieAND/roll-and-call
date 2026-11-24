import type { SessionRole } from "@/entities/game";

export function userSessionsHref({
  userId,
  role,
  past = false,
}: {
  userId: string;
  role: SessionRole;
  past?: boolean;
}): string {
  const base = `/users/${userId}/sessions/${role}`;
  return past ? `${base}?tab=past` : base;
}
