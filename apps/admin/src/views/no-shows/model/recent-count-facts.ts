import { NO_SHOW_STATUS } from "@/entities/no-show";
import type { NoShowDetail } from "@/entities/no-show/server";

// 취소 전후의 최근 30일 불참 횟수. 유효 기록은 이 기록을 포함해 세고, 취소된 기록은 빼고 센다. 기간 지난 기록은 횟수와 무관하다.
export function recentCountFacts(record: Pick<NoShowDetail, "status" | "recentNoShowCount">) {
  if (record.status === NO_SHOW_STATUS.valid) {
    return { without: record.recentNoShowCount - 1, with: record.recentNoShowCount };
  }
  if (record.status === NO_SHOW_STATUS.cancelled) {
    return { without: record.recentNoShowCount, with: record.recentNoShowCount + 1 };
  }
  return null;
}
