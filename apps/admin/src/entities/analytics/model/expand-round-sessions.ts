import type { RoundSlot, Session } from "@/shared/server";

// 통계는 다회차 구인을 회차마다 세션 하나로 센다. 단발은 그대로 두고, 다회차 구인은 일시가 있는 회차로 바꾼다.
export function expandRoundSessions(sessions: Session[], rounds: RoundSlot[]): Session[] {
  const gameOf = new Map(sessions.map((session) => [session.id, session]));
  return [
    ...sessions.filter((session) => (session.roundCount ?? 1) <= 1),
    ...rounds.flatMap((round) => {
      const game = gameOf.get(round.gameId);
      return game
        ? [
            {
              ...game,
              startsAt: round.startsAt,
              endsAt: round.endsAt,
              attendanceConfirmedAt: round.attendanceConfirmedAt,
            },
          ]
        : [];
    }),
  ];
}
