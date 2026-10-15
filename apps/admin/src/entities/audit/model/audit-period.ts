export const AUDIT_PERIODS = [
  { value: "today", label: "오늘", days: 1 },
  { value: "week", label: "최근 7일", days: 7 },
  { value: "month", label: "최근 30일", days: 30 },
] as const;

export type AuditPeriod = (typeof AUDIT_PERIODS)[number]["value"];

export const DEFAULT_AUDIT_PERIOD: AuditPeriod = "week";

// 「전체 기간」. UrlSelect의 전체 항목 값과 같다.
export const ALL_AUDIT_PERIOD = "all";
