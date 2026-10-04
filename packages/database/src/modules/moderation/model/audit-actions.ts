// 활동 기록 필터의 묶음과 순서는 시안(s4.jsx ACT_GROUPS)을 따른다.
export const AUDIT_ACTION_GROUPS = [
  {
    label: "룰북 인증",
    actions: ["인증 승인", "직접 인증", "인증 반려", "반려로 돌림"],
  },
  {
    label: "유저",
    actions: [
      "제재",
      "제재 해제",
      "추방",
      "차단 해제",
      "닉네임 수정",
      "불참 취소",
      "불참 취소 되돌리기",
      "불참 기록 추가",
      "운영진 메모",
    ],
  },
  {
    label: "구인",
    actions: ["구인 숨김", "구인 숨김 해제", "구인 취소", "신고 처리 완료"],
  },
  { label: "후기", actions: ["후기 숨김", "후기 숨김 해제", "후기 제거", "후기 신고 기각"] },
  { label: "시스템", actions: ["출석 자동 확인"] },
  {
    label: "룰북",
    actions: [
      "룰북 추가",
      "룰북 수정",
      "룰북 숨김",
      "룰북 연결",
      "추가 요청 반려",
      "퀴즈 문항 추가",
      "퀴즈 문항 수정",
      "판매처 추가",
      "판매처 빼기",
    ],
  },
  {
    label: "운영 · 설정",
    actions: ["운영진 추가", "운영진 해제", "설정 변경", "소유권 자동 이전"],
  },
] as const;

// 지금은 남기지 않지만 지난 기록에 남아 있는 조치 이름이다. 필터에는 보이지 않는다(D203: 봇 DM 없음).
export const LEGACY_AUDIT_ACTIONS = ["안내 DM"] as const;

export type AuditAction =
  | (typeof AUDIT_ACTION_GROUPS)[number]["actions"][number]
  | (typeof LEGACY_AUDIT_ACTIONS)[number];

export const AUDIT_ACTIONS: readonly AuditAction[] = AUDIT_ACTION_GROUPS.flatMap(
  (group) => group.actions,
);

// 이 조치들만 기록된 날부터 30일 뒤 DB가 지운다(마이그레이션 0027의 pg_cron). 목록을 바꾸면 cron도 다시 건다.
export const EXPIRING_AUDIT_ACTIONS: readonly string[] = [
  "안내 DM",
  "운영진 메모",
  "룰북 수정",
  "룰북 연결",
];
export const AUDIT_RETENTION_DAYS = 30;
