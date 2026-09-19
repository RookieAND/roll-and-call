import type { RosterMember } from "@/entities/game";

import type { ManagedMember } from "./managed-member";

type ParticipantRow = RosterMember<{
  userId: string;
  joinedAt: Date;
  user: { username: string; avatarUrl: string | null } | null;
}>;

export function toManagedMember(
  participant: ParticipantRow,
  availableUserIds: Set<string>,
): ManagedMember {
  return {
    userId: participant.userId,
    username: participant.user?.username ?? "익명",
    avatarUrl: participant.user?.avatarUrl ?? null,
    waitlistRank: participant.waitlistRank,
    hasAvailability: availableUserIds.has(participant.userId),
    joinedAt: participant.joinedAt,
  };
}
