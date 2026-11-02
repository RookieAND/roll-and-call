import type { SessionGame } from "@/entities/game";
import { formatDate } from "@/shared/lib";

import { joinParts } from "./join-parts";

export function pastEnding({
  waitlistRank,
  absent,
  finished,
  attendancePending,
  when,
  ago,
  endDate,
}: {
  waitlistRank: number | null;
  absent: boolean;
  finished: boolean;
  // 참여자에게만 켠다. GM은 같은 자리에 출석 확인 할 일이 붙는다.
  attendancePending: boolean;
  when: string | null;
  ago: string | null;
  endDate: SessionGame["endDate"];
}) {
  if (waitlistRank) {
    return { badge: "대기 종료", schedule: joinParts(when, "자리가 나지 않은 채 끝났습니다") };
  }
  if (absent) return { badge: "불참", schedule: joinParts(when, "참석하지 않았습니다", ago) };
  if (finished && attendancePending) {
    return { badge: "완료", schedule: joinParts(when, "GM이 출석을 확인하고 있습니다") };
  }
  if (finished) return { badge: "완료", schedule: joinParts(when, "세션을 마쳤습니다", ago) };
  return { badge: "무산", schedule: joinParts(formatDate(endDate), "일정을 정하지 못했습니다") };
}
