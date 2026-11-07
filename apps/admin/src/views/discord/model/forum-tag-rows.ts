export const PLAY_TYPE_ROWS = [
  { key: "voice", label: "보이스" },
  { key: "text", label: "텍스트" },
] as const;

export const KIND_ROWS = [
  { key: "briefing", label: "설명회" },
  { key: "session", label: "세션" },
] as const;

export const ADULT_ROWS = [{ key: "adult", label: "성인 전용" }] as const;

export const STATUS_ROWS = [
  { key: "open", label: "모집중" },
  { key: "closed", label: "마감" },
  { key: "cancelled", label: "취소됨" },
] as const;

// 룰 분류 표 맨 끝의 고정 행. 승인된 자작 룰 구인이 모두 이 태그 하나를 쓴다.
export const HOMEBREW_ROW = { key: "homebrew", label: "자작 룰" } as const;
