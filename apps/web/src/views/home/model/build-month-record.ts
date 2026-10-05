import {
  BADGE_ROLE,
  isRecordSession,
  recordAppearances,
  type BadgeRole,
} from "@roll-and-call/database/badges/model";

import { countConfirmed } from "@/entities/game";
import type { MonthSessionRow } from "@/shared/server";

import { rankPeople, type RecordPerson } from "./rank-people";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 이달의 GM·PL과 같은 판정(recordAppearances)으로 순위를 매긴다. 세션 건수는 순위에서 빼는 세션도 센다.
export function buildMonthRecord({ rows, now }: { rows: MonthSessionRow[]; now: Date }) {
  const people = new Map(
    rows
      .flatMap((row) => [row.gm, ...row.participants.map((participant) => participant.user)])
      .map((person): [string, RecordPerson] => [person.id, person]),
  );
  const appearances = recordAppearances(rows, now);
  const rankRole = (role: BadgeRole) =>
    rankPeople(
      appearances
        .filter((appearance) => appearance.role === role)
        .map((appearance) => ({
          person: people.get(appearance.userId)!,
          weight: appearance.weight,
        })),
    );

  return {
    sessionCount: rows.filter((row) =>
      isRecordSession({ ...row, confirmedCount: countConfirmed(row.participants) }, now),
    ).length,
    gms: rankRole(BADGE_ROLE.gm),
    players: rankRole(BADGE_ROLE.player),
  };
}
