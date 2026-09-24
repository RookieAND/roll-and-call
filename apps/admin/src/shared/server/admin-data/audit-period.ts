// 활동 기록 기간 필터. 값이 없으면 전체 기간이다.
export const AUDIT_PERIODS = [
  { value: "today", label: "오늘", days: 1 },
  { value: "week", label: "최근 7일", days: 7 },
  { value: "month", label: "최근 30일", days: 30 },
] as const;

export type AuditPeriod = (typeof AUDIT_PERIODS)[number]["value"];
