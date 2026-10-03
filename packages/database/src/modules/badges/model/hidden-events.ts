import { ambidextrousEvents } from "./ambidextrous-events";
import { anniversaryEvents } from "./anniversary-events";
import type { BadgeFacts } from "./badge-facts";
import { HIDDEN_LADDER, type HiddenLadderKey } from "./badge-ladder";
import { drawEvents } from "./draw-events";
import type { BadgeEvent } from "./reached-tier";
import { sameDayEvents } from "./same-day-events";

const EXPEDITION_MIN_ATTENDED = 6;
const POPULAR_MIN_APPLICANTS = 10;
const POPULAR_RATIO = 3;

// 숨겨진 칭호는 한 단계라 첫 사건이 획득 시각·근거다(R28).
export function hiddenEvents({
  facts,
  ladder,
}: {
  facts: BadgeFacts;
  ladder: HiddenLadderKey;
}): BadgeEvent[] {
  const { draws } = facts;
  switch (ladder) {
    case HIDDEN_LADDER.critical:
      return drawEvents({ draws, matches: (draw) => draw.roll === 1 });
    case HIDDEN_LADDER.extreme:
      return drawEvents({ draws, matches: (draw) => draw.roll >= 2 && draw.roll <= 10 });
    case HIDDEN_LADDER.luckySeven:
      return drawEvents({ draws, matches: (draw) => draw.roll === 77 });
    case HIDDEN_LADDER.fumble:
      return drawEvents({ draws, matches: (draw) => draw.roll === 100 });
    case HIDDEN_LADDER.nearMiss:
      return drawEvents({ draws, matches: (draw) => draw.nearMiss });
    case HIDDEN_LADDER.oneMonth:
      return anniversaryEvents({ facts, months: 1 });
    case HIDDEN_LADDER.halfYear:
      return anniversaryEvents({ facts, months: 6 });
    case HIDDEN_LADDER.oneYear:
      return anniversaryEvents({ facts, months: 12 });
    case HIDDEN_LADDER.ambidextrous:
      return ambidextrousEvents(facts);
    case HIDDEN_LADDER.doubleHeader:
      return sameDayEvents({ facts, count: 2 });
    case HIDDEN_LADDER.tripleHeader:
      return sameDayEvents({ facts, count: 3 });
    case HIDDEN_LADDER.expedition:
      return [...facts.played, ...facts.hosted]
        .filter((session) => session.attendedCount >= EXPEDITION_MIN_ATTENDED)
        .toSorted((left, right) => left.endsAt.getTime() - right.endsAt.getTime())
        .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
    case HIDDEN_LADDER.popular:
      return facts.hostedDraws
        .filter(
          (draw) =>
            draw.applicants >= POPULAR_MIN_APPLICANTS &&
            draw.applicants >= draw.maxPlayers * POPULAR_RATIO,
        )
        .toSorted((left, right) => left.drawnAt.getTime() - right.drawnAt.getTime())
        .map((draw) => ({ at: draw.drawnAt, gameId: draw.gameId }));
    case HIDDEN_LADDER.rush:
      return facts.rush;
  }
}
