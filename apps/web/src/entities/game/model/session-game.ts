import type { Game } from "@roll-and-call/database";

import type { ParticipantStatus } from "./participant";

interface SessionParticipant {
  userId: string;
  status: ParticipantStatus;
  joinedAt: Date | string;
  absent: boolean;
  absenceAt?: Date | string | null;
  lateJoined?: boolean;
  leftReason?: string | null;
}

export type SessionGame = Game & {
  gm: { username: string; avatarUrl: string | null } | null;
  participants: SessionParticipant[];
  // 다회차에서 내가 출석 확정·종료된 회차 중 참석한 횟수. getJoinedGames가 채운다.
  attendedRoundCount?: number;
};
