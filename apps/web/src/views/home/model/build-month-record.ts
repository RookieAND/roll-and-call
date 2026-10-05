import {
  BADGE_ROLE,
  isRecordSession,
  monthScoreboard,
  type BadgeRole,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";

import { countConfirmed } from "@/entities/game";
import type { MonthSessionRow } from "@/shared/server";

import { rankPeople, type RecordPerson } from "./rank-people";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 이달의 GM·PL과 같은 점수판(monthScoreboard)으로 순위를 매긴다. 세션 건수는 타이만·미니룰도 센다.
// people에는 점수는 있는데 이 달 세션 목록에 없는 사람(앞선 달 세션의 후기 점수)을 더해 준다.
export function buildMonthRecord({
  rows,
  appearances,
  month,
  extraPeople = [],
  now,
}: {
  rows: MonthSessionRow[];
  appearances: MonthlyAppearance[];
  month: string;
  extraPeople?: RecordPerson[];
  now: Date;
}) {
  const people = new Map(
    [
      ...rows.flatMap((row) => [
        row.gm,
        ...row.participants.map((participant) => participant.user),
      ]),
      ...extraPeople,
    ].map((person): [string, RecordPerson] => [person.id, person]),
  );
  const rankRole = (role: BadgeRole) =>
    rankPeople(monthScoreboard({ appearances, role, month }), people);

  return {
    sessionCount: rows.filter((row) =>
      isRecordSession({ ...row, confirmedCount: countConfirmed(row.participants) }, now),
    ).length,
    gms: rankRole(BADGE_ROLE.gm),
    players: rankRole(BADGE_ROLE.player),
  };
}
