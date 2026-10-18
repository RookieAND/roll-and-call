import type { AuditAction } from "@roll-and-call/database/audit/model";
export const USER_VISIBLE_REASON_ACTIONS: readonly AuditAction[] = [
  "인증 반려",
  "반려로 돌림",
  "제재",
  "제재 해제",
  "구인 숨김",
  "추가 요청 반려",
];
