import type { AdminGameRounds } from "@roll-and-call/database/games";

export type AdminRound = AdminGameRounds["rounds"][number];
export type AdminRoundSkip = AdminGameRounds["skips"][number];
// now는 서버가 한 번 정한 현재 시각이다. 상태를 시각으로 가르는 데 쓴다.
export type AdminRoundsView = AdminGameRounds & { now: Date };
