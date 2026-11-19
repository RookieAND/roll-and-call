import { groupBy, isNil } from "es-toolkit";

import { PARTICIPANT_STATUS } from "#db/modules/games/model";

import { countsAsAttended } from "./counts-as-attended";
import { kstDayKey } from "./kst-day-key";
import type { RecordGame } from "./record-session";

type Round = {
  id: string;
  startAt: Date;
  plannedEndAt: Date | null;
  endedAt: Date | null;
  attendanceConfirmedAt: Date | null;
};

export type MultiRoundGame = {
  game: Omit<RecordGame, "confirmedAt" | "playMinutes" | "endedAt" | "participants">;
  rounds: Round[];
  participants: (RecordGame["participants"][number] & {
    leftReason: string | null;
    absenceAt: Date | null;
  })[];
  // 회차 출석 기록(attended = true인 사람만)
  attendedByRound: Map<string, Set<string>>;
};

const latest = (dates: Date[]) => new Date(Math.max(...dates.map((date) => date.getTime())));

// 다회차 구인을 같은 한국 날짜의 회차끼리 묶어 1회로 센다. 회차 불참은 감점이 없고, 출석 확인 전인 날은 현재 확정자를 모두 센다.
// 출석을 확정한 회차는 회차 출석 기록이 기준이라, 뒤에 내보내지거나 하차한 사람도 출석한 회차는 그대로 센다.
export function multiRoundRecordGames({
  game,
  rounds,
  participants,
  attendedByRound,
}: MultiRoundGame): RecordGame[] {
  const days = groupBy(rounds, (round) => kstDayKey(round.startAt));
  const seated = participants.filter(
    (participant) =>
      participant.status === PARTICIPANT_STATUS.confirmed && countsAsAttended(participant),
  );
  return Object.values(days).map((dayRounds) => {
    const confirmedRounds = dayRounds.filter((round) => !isNil(round.attendanceConfirmedAt));
    const attendedIds = new Set(
      confirmedRounds.flatMap((round) => [...(attendedByRound.get(round.id) ?? [])]),
    );
    const ends = dayRounds.flatMap((round) => round.endedAt ?? round.plannedEndAt ?? []);
    return {
      ...game,
      confirmedAt: new Date(Math.min(...dayRounds.map((round) => round.startAt.getTime()))),
      endedAt: ends.length > 0 ? latest(ends) : null,
      playMinutes: null,
      participants:
        confirmedRounds.length > 0
          ? participants
              .filter((participant) => attendedIds.has(participant.userId))
              .map((participant) => ({
                ...participant,
                status: PARTICIPANT_STATUS.confirmed,
                absent: false,
                absenceCancelledAt: null,
              }))
          : seated,
    };
  });
}
