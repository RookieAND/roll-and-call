import {
  BADGE_ROLE,
  isRecordSession,
  miniRuleOf,
  recordAppearances,
  type BadgeRole,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";
import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";

import { countConfirmed } from "@/entities/game";
import type { MonthSessionRow } from "@/shared/server";

import { rankPeople, type RecordPerson } from "./rank-people";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 이달의 GM·PL과 같은 판정(recordAppearances)으로 순위를 매긴다. 세션 건수는 순위에서 빼는 세션도 센다.
// 포인트제는 후기 점수(reviews)도 더한다. 후기는 PL 점수에만 들어간다.
export function buildMonthRecord({
  rows,
  now,
  mode = RANKING_MODE.count,
  reviews = [],
}: {
  rows: MonthSessionRow[];
  now: Date;
  mode?: RankingMode;
  reviews?: MonthlyAppearance[];
}) {
  const people = new Map(
    rows
      .flatMap((row) => [row.gm, ...row.participants.map((participant) => participant.user)])
      .map((person): [string, RecordPerson] => [person.id, person]),
  );
  const appearances = [
    ...recordAppearances(
      rows.map((row) => ({ ...row, miniRule: miniRuleOf(row) })),
      now,
      { mode },
    ),
    ...(mode === RANKING_MODE.points ? reviews : []),
  ].filter((appearance) => people.has(appearance.userId));
  const rankRole = (role: BadgeRole) =>
    rankPeople(
      appearances
        .filter((appearance) => appearance.role === role)
        .map((appearance) => ({
          person: people.get(appearance.userId)!,
          weight: appearance.weight,
          sessions: appearance.sessions,
        })),
    );

  return {
    mode,
    sessionCount: rows.filter((row) =>
      isRecordSession({ ...row, confirmedCount: countConfirmed(row.participants) }, now),
    ).length,
    gms: rankRole(BADGE_ROLE.gm),
    players: rankRole(BADGE_ROLE.player),
  };
}
