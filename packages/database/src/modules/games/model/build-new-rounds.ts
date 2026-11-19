import type { NewGameRound } from "#db/schema";

import type { RoundSpan } from "./overlapping-round-numbers";

export type NewRoundRow = Omit<NewGameRound, "serverId" | "gameId">;

// 다회차 구인을 만들 때 넣을 회차 행. 지정형은 넘긴 일시마다 한 행이고, 조율형은 1회차(일시 또는 조율 중)에
// 아직 일시가 없는 뒤 회차를 예정 회차 수까지 채운다. 회차 번호는 1부터 순서대로다.
export function buildNewRounds({
  scheduleKind,
  roundCount,
  dated,
  firstRoundCoordination,
}: {
  scheduleKind: "designated" | "coordinated";
  roundCount: number;
  dated: readonly RoundSpan[];
  firstRoundCoordination?: { start: string; end: string; timezone: string };
}): NewRoundRow[] {
  const scheduled = (span: RoundSpan, roundNo: number): NewRoundRow => ({
    roundNo,
    startAt: span.startsAt,
    plannedEndAt: span.endsAt,
    status: "scheduled",
  });
  if (scheduleKind === "designated") return dated.map((span, index) => scheduled(span, index + 1));
  const first: NewRoundRow = dated[0]
    ? scheduled(dated[0], 1)
    : {
        roundNo: 1,
        status: "coordinating",
        coordinationStart: firstRoundCoordination?.start,
        coordinationEnd: firstRoundCoordination?.end,
        coordinationTimezone: firstRoundCoordination?.timezone,
      };
  const rest = Array.from({ length: roundCount - 1 }, (_, index) => ({
    roundNo: index + 2,
    status: "unscheduled" as const,
  }));
  return [first, ...rest];
}
