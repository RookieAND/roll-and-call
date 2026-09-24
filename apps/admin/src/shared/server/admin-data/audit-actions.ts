// 활동 기록의 조치 종류. 조치 모달의 확정 버튼 하나가 이 중 하나에 대응한다.
export const AUDIT_ACTION_GROUPS = [
  { label: "룰북 인증", actions: ["인증 승인", "인증 반려", "인증 취소", "안내 DM"] },
  { label: "유저", actions: ["제재", "제재 해제", "불참 취소", "운영진 메모"] },
  { label: "구인", actions: ["구인 수정 요청", "구인 숨김", "구인 숨김 해제", "신고 처리 완료"] },
  {
    label: "룰북",
    actions: ["룰북 추가", "룰북 수정", "룰북 숨김", "룰북 연결", "추가 요청 반려"],
  },
  { label: "운영 · 설정", actions: ["운영진 추가", "운영진 해제", "역할 변경", "적용일 변경"] },
] as const;

export type AuditAction = (typeof AUDIT_ACTION_GROUPS)[number]["actions"][number];

export const AUDIT_ACTIONS = AUDIT_ACTION_GROUPS.flatMap(
  (group) => group.actions,
) as readonly AuditAction[];
