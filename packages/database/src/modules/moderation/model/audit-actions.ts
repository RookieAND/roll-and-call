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
    actions: ["구인 숨김", "구인 숨김 해제", "구인 취소"],
  },
  { label: "후기", actions: ["후기 숨김", "후기 숨김 해제", "후기 제거"] },
  { label: "시스템", actions: ["출석 자동 확인"] },
  {
    label: "룰북",
    actions: [
      "룰북 추가",
      "룰북 수정",
      "룰북 숨김",
      "룰북 숨김 해제",
      "룰북 연결",
      "미니룰 변경",
      "추가 요청 반려",
      "퀴즈 문항 추가",
      "퀴즈 문항 수정",
      "판매처 추가",
      "판매처 빼기",
    ],
  },
  {
    label: "운영 · 설정",
    actions: [
      "운영진 추가",
      "운영진 해제",
      "서버 설정 변경",
      "디스코드 메시지 변경",
      "소유권 자동 이전",
    ],
  },
] as const;

// 필터에서 뺐지만 지난 기록에 남아 있는 조치 이름이다. 화면에는 이 이름 그대로 보인다.
export const LEGACY_AUDIT_ACTIONS = [
  "안내 DM",
  "신고 처리 완료",
  "후기 신고 기각",
  "구인 수정 요청",
  "적용일 변경",
  "역할 변경",
] as const;

// 이름을 바꾼 조치. 지난 기록은 DB에 옛 이름으로 남고 화면에서만 새 이름으로 보인다(auditActionLabel).
export const RENAMED_AUDIT_ACTIONS: Readonly<Record<string, AuditAction>> = {
  "설정 변경": "서버 설정 변경",
};

// 무거운 조치(제재, 반려로 돌림, 직접 인증)가 related에 남기는 운영진 채널 줄. 조치 상세 「운영진 채널」 칸이 읽는다.
export const STAFF_CHANNEL_RELATED = {
  posted: "운영진 채널에 글 올림",
  missing: "운영진 채널 없음",
} as const;

export type AuditAction =
  | (typeof AUDIT_ACTION_GROUPS)[number]["actions"][number]
  | (typeof LEGACY_AUDIT_ACTIONS)[number];

export const AUDIT_ACTIONS: readonly AuditAction[] = AUDIT_ACTION_GROUPS.flatMap(
  (group) => group.actions,
);

// 이 조치들만 기록된 날부터 30일 뒤 DB가 지운다(마이그레이션 0056의 pg_cron). 목록을 바꾸면 cron도 다시 건다.
export const EXPIRING_AUDIT_ACTIONS: readonly string[] = ["룰북 수정", "룰북 연결"];
export const AUDIT_RETENTION_DAYS = 30;
