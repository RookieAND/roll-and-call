import type { SessionGame } from "@/entities/game";
import { formatMonthDay } from "@/shared/lib";

export function pastEnding({
  waitlistRank,
  absent,
  finished,
  when,
  endDate,
}: {
  waitlistRank: number | null;
  absent: boolean;
  finished: boolean;
  when: string | null;
  endDate: SessionGame["endDate"];
}) {
  if (waitlistRank) {
    return { badge: "대기 종료", schedule: when ?? "", note: "자리가 나지 않은 채 끝났습니다" };
  }
  if (absent) return { badge: "불참", schedule: when ?? "", note: "참석하지 않았습니다" };
  if (finished) return { badge: "완료", schedule: when ?? "", note: null };
  return { badge: "무산", schedule: formatMonthDay(endDate), note: "일정을 정하지 못했습니다" };
}
