export const PERMISSION_ROWS = [
  { label: "인증 심사 · 불참 기록 취소 · 제재", owner: true, staff: true },
  { label: "룰북 목록 관리", owner: true, staff: true },
  { label: "운영진 추가·해제", owner: true, staff: false },
  { label: "서비스 설정 · 적용일 변경", owner: true, staff: false },
] as const;
