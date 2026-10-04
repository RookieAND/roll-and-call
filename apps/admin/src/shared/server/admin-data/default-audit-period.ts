import { ALL_AUDIT_PERIOD, DEFAULT_AUDIT_PERIOD } from "./audit-period";

// 검색어나 대상 거르기가 있으면 오래된 기록까지 봐야 하므로 기본이 전체 기간이다.
export function defaultAuditPeriod({ scoped }: { scoped: boolean }) {
  return scoped ? ALL_AUDIT_PERIOD : DEFAULT_AUDIT_PERIOD;
}
