// 활동 기록 기간 필터. all이거나 목록에 없는 값이면 전체 기간이다.
export const AUDIT_PERIODS = [
  { value: "today", label: "오늘", days: 1 },
  { value: "week", label: "최근 7일", days: 7 },
  { value: "month", label: "최근 30일", days: 30 },
] as const;

export type AuditPeriod = (typeof AUDIT_PERIODS)[number]["value"];

// 쿼리에 기간이 없을 때. 대상으로 좁혀 볼 때는 전체 기간을 쓴다.
export const DEFAULT_AUDIT_PERIOD: AuditPeriod = "week";
