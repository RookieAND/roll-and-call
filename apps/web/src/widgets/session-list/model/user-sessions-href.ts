import { SESSION_ROLE, type SessionRole } from "@/entities/game";

// 어느 "모두 보기"로 들어와도 그 역할 탭이 선택된 상태로 연다. 기본 탭(운영)은 주소에 남기지 않는다.
export function userSessionsHref(userId: string, role: SessionRole): string {
  const base = `/u/${userId}/sessions`;
  return role === SESSION_ROLE.host ? base : `${base}?tab=${role}`;
}
