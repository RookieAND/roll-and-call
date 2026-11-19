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
};
