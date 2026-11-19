import type { Game } from "@roll-and-call/database";
import {
  buildNewRounds,
  buildRepeatRounds,
  repeatRuleOf,
  type NewRoundRow,
  type RoundSpan,
  type TargetRound,
} from "@roll-and-call/database/games/model";

import { ROUND_SCHEDULE_KIND, SCHEDULE_MODE } from "@/entities/game";

import type { SplitTeamsScheduleColumns } from "./split-teams-schedule";

const WEEK_MS = 7 * 24 * 3_600_000;

export interface SplitTeamsRounds {
  repeatRule: Game["repeatRule"];
  rows: NewRoundRow[];
  // 일시가 정해진 회차. 겹침 검사에 쓴다.
  dated: TargetRound[];
}

interface OriginalRound {
  startAt: Date | null;
  plannedEndAt: Date | null;
}

// 반복 규칙이 없는(직접 입력) 구인은 원래 회차가 1회차에서 떨어진 간격과 길이를 새 1회차에 그대로 옮긴다.
function copyRoundOffsets({
  first,
  originals,
  count,
}: {
  first: RoundSpan;
  originals: readonly OriginalRound[];
  count: number;
}): RoundSpan[] {
  const base = originals[0]?.startAt;
  return Array.from({ length: count }, (_, index) => {
    const original = originals[index];
    if (index === 0) return first;
    // 날짜를 알 수 없는 회차는 앞 회차의 일주일 뒤로 둔다.
    if (!base || !original?.startAt || !original.plannedEndAt) {
      return {
        startsAt: new Date(first.startsAt.getTime() + index * WEEK_MS),
        endsAt: new Date(first.endsAt.getTime() + index * WEEK_MS),
      };
    }
    const startsAt = new Date(
      first.startsAt.getTime() + original.startAt.getTime() - base.getTime(),
    );
    return {
      startsAt,
      endsAt: new Date(
        startsAt.getTime() + original.plannedEndAt.getTime() - original.startAt.getTime(),
      ),
    };
  });
}

// 다회차 구인을 나눌 때 새 구인의 회차 행. 단발이면 null이다.
// 지정형은 1회차 시작·종료에서 원 구인의 반복 간격(없으면 원 회차 간격)으로 모든 회차를 만들고,
// 조율형은 1회차만 정하고 나머지는 일시 없이 만든다.
export function splitTeamsRounds({
  game,
  originals,
  schedule,
  firstRoundEndsAt,
}: {
  game: Pick<Game, "roundCount" | "roundScheduleKind" | "repeatRule">;
  originals: readonly OriginalRound[];
  schedule: SplitTeamsScheduleColumns;
  firstRoundEndsAt?: Date;
}): SplitTeamsRounds | null | { error: string } {
  if (game.roundCount <= 1) return null;
  const startsAt = schedule.confirmedAt;
  const first =
    schedule.scheduleMode === SCHEDULE_MODE.fixed && startsAt && firstRoundEndsAt
      ? { startsAt, endsAt: firstRoundEndsAt }
      : undefined;
  if (first && first.endsAt.getTime() <= first.startsAt.getTime()) {
    return { error: "1회차 종료는 시작보다 늦어야 합니다." };
  }

  if (game.roundScheduleKind === ROUND_SCHEDULE_KIND.coordinated) {
    const rows = buildNewRounds({
      scheduleKind: game.roundScheduleKind,
      roundCount: game.roundCount,
      dated: first ? [first] : [],
      firstRoundCoordination:
        schedule.rangeStart && schedule.rangeEnd
          ? { start: schedule.rangeStart, end: schedule.rangeEnd, timezone: "Asia/Seoul" }
          : undefined,
    });
    return {
      repeatRule: game.repeatRule,
      rows,
      dated: first ? [{ roundNo: 1, ...first }] : [],
    };
  }

  if (!first) return { error: "1회차 시작과 종료를 정해 주세요." };
  const intervalWeeks = game.repeatRule?.intervalWeeks;
  const spans = intervalWeeks
    ? buildRepeatRounds({ first, intervalWeeks, count: game.roundCount })
    : copyRoundOffsets({ first, originals, count: game.roundCount });
  return {
    repeatRule: intervalWeeks ? repeatRuleOf({ first, intervalWeeks }) : null,
    rows: buildNewRounds({
      scheduleKind: game.roundScheduleKind,
      roundCount: game.roundCount,
      dated: spans,
    }),
    dated: spans.map((span, index) => ({ roundNo: index + 1, ...span })),
  };
}
