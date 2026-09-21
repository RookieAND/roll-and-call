import type { ParticipantStatus } from "@/entities/game";

export type Candidate = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  status: ParticipantStatus | null;
};
