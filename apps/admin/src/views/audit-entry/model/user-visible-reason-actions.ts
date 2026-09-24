import type { AuditAction } from "@/shared/server";

// 사유가 사용자 화면에 그대로 보이는 조치. 나머지는 활동 기록에만 남는다.
export const USER_VISIBLE_REASON_ACTIONS: readonly AuditAction[] = [
  "인증 반려",
  "인증 취소",
  "제재",
  "제재 해제",
  "구인 수정 요청",
  "구인 숨김",
  "추가 요청 반려",
];
