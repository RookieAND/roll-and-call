import { addDays } from "./add-days";
import type { TimeRow } from "./build-time-rows";
import { slotIso } from "./slot-iso";

// 열 날짜 + 줄 → 칸 시작 시각. 자정 뒤 줄은 다음 날로 넘긴다.
export function rowSlotIso({ date, row }: { date: string; row: TimeRow }): string {
  return slotIso({
    date: addDays({ date, count: row.dayOffset }),
    hour: row.hour,
    minute: row.minute,
  });
}
