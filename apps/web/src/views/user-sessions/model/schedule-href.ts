import type { SessionRole } from "@/entities/game";
import { userSessionsHref } from "@/widgets/session-list";

import { SCHEDULE_TAB, type ScheduleTab } from "./schedule-tab";

// 탭은 지난 쪽만 쿼리에 적는다(기본이 진행 예정이라서).
export function scheduleHref({
  userId,
  role,
  tab = SCHEDULE_TAB.upcoming,
  date,
  month,
}: {
  userId: string;
  role: SessionRole;
  tab?: ScheduleTab;
  date?: string;
  month?: string;
}): string {
  const base = userSessionsHref({ userId, role });
  const query = new URLSearchParams();
  if (tab === SCHEDULE_TAB.past) query.set("tab", tab);
  if (date) query.set("date", date);
  if (month) query.set("month", month);
  const text = query.toString();
  return text ? `${base}?${text}` : base;
}
