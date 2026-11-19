import type { RoundSpan } from "@roll-and-call/database/games/model";

import { fromKstDateTimeInput } from "@/shared/lib";

// 시작·종료가 모두 채워진 회차만 시각으로 바꾼다. 호출하는 쪽이 빈 칸이 없음을 먼저 확인한다.
export function multiRoundSpans({
  confirmedAt,
  firstRoundEndAt,
  laterRounds = [],
}: {
  confirmedAt?: string;
  firstRoundEndAt?: string;
  laterRounds?: readonly { startAt: string; endAt: string }[];
}): RoundSpan[] {
  const first =
    confirmedAt && firstRoundEndAt ? [{ startAt: confirmedAt, endAt: firstRoundEndAt }] : [];
  return [...first, ...laterRounds].map(({ startAt, endAt }) => ({
    startsAt: fromKstDateTimeInput(startAt),
    endsAt: fromKstDateTimeInput(endAt),
  }));
}
