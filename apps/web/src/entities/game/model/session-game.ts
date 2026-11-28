import type { GameListRow } from "@roll-and-call/database";

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

export type SessionGame = GameListRow & {
  gm: { username: string; avatarUrl: string | null } | null;
  participants: SessionParticipant[];
  // 다회차에서 내가 출석 확정·종료된 회차 중 참석한 횟수. getJoinedGames가 채운다.
  attendedRoundCount?: number;
  // 조율형 다회차: 일정을 안 정한 가장 앞 회차 번호와 일정 있는 회차의 가장 늦은 종료. getGamesByGm이 채운다.
  nextUnscheduledRoundNo?: number | null;
  lastRoundEndAt?: Date | string | null;
};
