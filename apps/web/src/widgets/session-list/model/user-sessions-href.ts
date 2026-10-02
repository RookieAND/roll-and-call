import { SESSION_ROLE, type SessionRole } from "@/entities/game";

export function userSessionsHref({ userId, role }: { userId: string; role: SessionRole }): string {
  const base = `/users/${userId}/sessions`;
  return role === SESSION_ROLE.host ? base : `${base}?tab=${role}`;
}
