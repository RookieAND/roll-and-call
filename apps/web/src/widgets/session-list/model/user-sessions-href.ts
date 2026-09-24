import { SESSION_ROLE, type SessionRole } from "@/entities/game";

// 프로필의 운영·참여 수 중 어느 쪽을 눌러도 그 역할 탭이 선택된 상태로 연다. 기본 탭(운영)은 주소에 남기지 않는다.
export function userSessionsHref(userId: string, role: SessionRole): string {
  const base = `/u/${userId}/sessions`;
  return role === SESSION_ROLE.host ? base : `${base}?tab=${role}`;
}
