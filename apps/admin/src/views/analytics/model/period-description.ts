import { formatDayRange } from "@/shared/lib";
import type { AnalyticsData } from "@/shared/server";

const NO_COMPARE = "비교할 지난 기간이 없습니다";

export function periodDescription({
  early,
  compare,
  period,
}: Pick<AnalyticsData, "early" | "compare" | "period">) {
  const range = formatDayRange(period.from, period.to);
  if (early) return `${range} · 서비스 시작 후 ${period.serviceWeeks}주 · ${NO_COMPARE}`;
  return `${range} · ${compare ? "지난 4주와 비교" : NO_COMPARE}`;
}
