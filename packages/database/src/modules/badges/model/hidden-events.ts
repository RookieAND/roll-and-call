import { allNightEvents } from "./all-night-events";
import { ambidextrousEvents } from "./ambidextrous-events";
import { anniversaryEvents } from "./anniversary-events";
import type { BadgeFacts } from "./badge-facts";
import { HIDDEN_LADDER, type HiddenLadderKey } from "./badge-ladder";
import { dayStreakEvents } from "./day-streak-events";
import { drawEvents } from "./draw-events";
import { lightningEvents } from "./lightning-events";
import { owlEvents } from "./owl-events";
import type { BadgeEvent } from "./reached-tier";
import { sameDayEvents } from "./same-day-events";
import { weekdayEvents } from "./weekday-events";
import { winStreakEvents } from "./win-streak-events";

const EXPEDITION_MIN_ATTENDED = 6;
const CROWDED_MIN_APPLICANTS = 10;
const CROWDED_RATIO = 3;
const MARATHON_MINUTES = 360;
const HUNDRED_DAYS = 100;
const PULLUP_MIN_PLAYERS = 3;
const REVIVE_MIN_PLAYERS = 4;
const REVIVE_MIN_ROLL = 80;
const COIN_ROLL = 50;

const isCrowded = ({ applicants, maxPlayers }: { applicants: number; maxPlayers: number }) =>
  applicants >= CROWDED_MIN_APPLICANTS && applicants >= maxPlayers * CROWDED_RATIO;

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
        .filter(isCrowded)
        .toSorted((left, right) => left.drawnAt.getTime() - right.drawnAt.getTime())
        .map((draw) => ({ at: draw.drawnAt, gameId: draw.gameId }));
    case HIDDEN_LADDER.needle:
      return drawEvents({ draws, matches: (draw) => draw.picked && isCrowded(draw) });
    case HIDDEN_LADDER.marathon:
      return [...facts.played, ...facts.hosted]
        .filter(
          (session) =>
            session.endsAt.getTime() - session.startsAt.getTime() >= MARATHON_MINUTES * 60_000,
        )
        .toSorted((left, right) => left.endsAt.getTime() - right.endsAt.getTime())
        .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
    case HIDDEN_LADDER.rush:
      return facts.rush;
    case HIDDEN_LADDER.hundred:
      return anniversaryEvents({ facts, days: HUNDRED_DAYS });
    case HIDDEN_LADDER.owl:
      return owlEvents(facts);
    case HIDDEN_LADDER.pullUp:
      return drawEvents({
        draws,
        matches: (draw) =>
          draw.picked &&
          draw.lastSeat &&
          draw.applicants > draw.maxPlayers &&
          draw.maxPlayers >= PULLUP_MIN_PLAYERS,
      });
    case HIDDEN_LADDER.lightning:
      return lightningEvents(facts);
    case HIDDEN_LADDER.wins3:
      return winStreakEvents({ draws, length: 3 });
    case HIDDEN_LADDER.days3:
      return dayStreakEvents({ facts, length: 3 });
    case HIDDEN_LADDER.allNight:
      return allNightEvents(facts);
    case HIDDEN_LADDER.fullCast:
      return facts.fullCasts;
    case HIDDEN_LADDER.weekdays:
      return weekdayEvents(facts);
    case HIDDEN_LADDER.coin:
      return drawEvents({ draws, matches: (draw) => draw.roll === COIN_ROLL });
    case HIDDEN_LADDER.revive:
      return drawEvents({
        draws,
        matches: (draw) =>
          draw.picked && draw.maxPlayers >= REVIVE_MIN_PLAYERS && draw.roll >= REVIVE_MIN_ROLL,
      });
    case HIDDEN_LADDER.days7:
      return dayStreakEvents({ facts, length: 7 });
    case HIDDEN_LADDER.wins5:
      return winStreakEvents({ draws, length: 5 });
    case HIDDEN_LADDER.days10:
      return dayStreakEvents({ facts, length: 10 });
  }
}
