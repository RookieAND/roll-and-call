export const PERMISSION_ROWS = [
  { label: "인증 심사 · 불참 기록 취소 · 제재 · 추방", owner: true, staff: true },
  { label: "운영진 지정·해제", owner: true, staff: false },
  { label: "서버 설정 변경", owner: true, staff: false },
] as const;
